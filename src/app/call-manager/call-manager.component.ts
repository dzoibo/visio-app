import {SwiperOptions} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from "ngx-socket-io";
import { v4 as uuidv4 } from 'uuid';
import { VideoElement } from '../models/models';
import Peer from 'peerjs';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent } from 'ngx-agora';
 
@Component({
  selector: 'app-call-manager',
  templateUrl: './call-manager.component.html',
  styleUrls: ['./call-manager.component.scss']
})

export class CallManagerComponent implements OnInit{
  @ViewChild('swiper', { static: false }) swiper!: SwiperComponent;

  declare Peer: new (arg0: any, arg1: {host: string; port: number;})=>any;
  config: SwiperOptions={
    slidesPerView: "auto",
    spaceBetween: 10,
    navigation: true,
    pagination: { 
      el: ".swiper-pagination" ,
      dynamicBullets: true,
      type: "progressbar"
    },

    scrollbar: { 
      draggable: true,
      dragSize: 100,
    },
  };
  
  show_user_list=true;
  display_chat=true;
  chatMode='group';
  videos: VideoElement[]=[];
  myPeer: any;

  private client!: AgoraClient;
  private localStream!: Stream;
  uid!: string;
  remoteCalls: string []=[];

  constructor(
    private router: Router,
    private socket: Socket,
    private ngxAgoraService: NgxAgoraService,
    private route: ActivatedRoute
  ){
    
    this.uid=uuidv4();
  }

  toggle_chat(){
    this.display_chat= !this.display_chat;
  }

  toggle_user_list(){
    this.show_user_list=!this.show_user_list;
  }

  setChatMode(chatMode: string){
    this.chatMode= chatMode;
  }

  createRoom(){
    //we are just creating a unique string that will be used as a user ID. Instead of this the best proccess is to use use UUID library
    this.router.navigate(['meeting/'+this.uid+'']);
    /**
     * this.joinNewCall();
     */
    
  }

  //code for the video part


  ngOnInit(){
    this.client=this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.assignClientHandlers();

    this.myPeer= new Peer (
      this.uid,
      {
       host: '/',
       port: 4200
      });
      console.log('on continue sans pb');

      this.route.params.subscribe((params) => {
        if(params['id']!==undefined && params['id'].trim().length>0){
          this.myPeer.on('open', (userId: any) => {
            console.log('open per ')
            this.socket.emit('join-room', params['roomId'], userId);
            this.joinNewCall();
          });  
        }
      });
  
      
  
      this.socket.on('user-disconnected', (userId: any) => {
        console.log(`receiving user-disconnected event from ${userId}`)
        this.videos = this.videos.filter(video => video.userId !== userId);
      });
  }
  
  assignClientHandlers(){
    this.client.on(ClientEvent.LocalStreamPublished,evt=>{
      console.log('publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, error => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          renewError => console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, err => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }
  
  private getRemoteId(stream: Stream): string {
    return 'agora_remote-'+stream.getId();
  }

  addMyVideo(stream: MediaStream) {
    console.log(' we na add a new video');
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.uid,
    });
  }
    
  joinNewCall(){
    console.log("let's join a new meeting room");
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).catch((err) => {
      console.log('[Error] Not able to retrieve user media:', err);
      return null;
    }).then((stream: any ) => {
      if (stream!==null) {
        this.addMyVideo(stream);
      }
      this.myPeer.on('call', (call: any) => {
        call.answer(stream);

        call.on('stream', (otherUserVideoStream: MediaStream) => {
          this.addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
        });

        call.on('error', (err: any) => {
          console.error(err);
        })
      });

      this.socket.on('user-connected', (userId: string ) => {
        console.log('Receiving user-connected event', `Calling ${userId}`);

        // Let some time for new peers to be able to answer
        setTimeout(() => {
          const call = this.myPeer.call(userId, stream, {
            metadata: { userId: this.uid },
          });
          call.on('stream', (otherUserVideoStream: MediaStream) => {
            console.log('receiving other user stream after his connection');
            this.addOtherUserVideo(userId, otherUserVideoStream);
          });

          call.on('close', () => {
            this.videos = this.videos.filter((video) => video.userId !== userId);
          });
        }, 1000);
      });
    });
    console.log(this.videos);
  }
  
  addOtherUserVideo(userId: string, stream: MediaStream) {
    const alreadyExisting = this.videos.some(video => video.userId === userId);
    if (alreadyExisting) {
      console.log(this.videos, userId);
      return;
    }
    this.videos.push({
      muted: false,
      srcObject: stream,
      userId,
    });
  }
  
  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }
}


import {SwiperOptions} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from "ngx-socket-io";
import { v4 as uuidv4 } from 'uuid';
import { VideoElement } from '../models/models';
import Peer from 'peerjs';
 
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
    },};
  currentUserId='';
  show_user_list=true;
  display_chat=true;
  chatMode='group';
  videos: VideoElement[]=[];
  myPeer: any;

  constructor(
    private router: Router,
    private socket: Socket,
    private route: ActivatedRoute
  ){
    this.currentUserId=uuidv4();
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
    this.router.navigate(['meeting/'+this.currentUserId+'']);
    this.joinNewCall();
  }

  //code for the video part


  ngOnInit(){
    this.myPeer= new Peer (
      this.currentUserId,
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
  
    addMyVideo(stream: MediaStream) {
      console.log(' we na add a new video');
      this.videos.push({
        muted: true,
        srcObject: stream,
        userId: this.currentUserId,
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
              metadata: { userId: this.currentUserId },
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


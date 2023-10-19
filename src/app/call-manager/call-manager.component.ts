import {SwiperOptions} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-call-manager',
  templateUrl: './call-manager.component.html',
  styleUrls: ['./call-manager.component.scss']
})

export class CallManagerComponent implements OnInit{
  @ViewChild('swiper', { static: false }) swiper!: SwiperComponent;
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

  ngOnInit(){
    
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

}

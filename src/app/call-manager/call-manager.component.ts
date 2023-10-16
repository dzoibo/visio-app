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

  ngOnInit(){
    
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-call-manager',
  templateUrl: './call-manager.component.html',
  styleUrls: ['./call-manager.component.scss']
})
export class CallManagerComponent implements OnInit{
  @ViewChild('swiper', { static: false }) swiper!: SwiperComponent;
  config!: SwiperOptions;

  ngOnInit(){
    this.config={
      slidesPerView:4,
      autoHeight: true,
      centerInsufficientSlides: true,
      centeredSlides: true,
      freeMode: true,
      scrollbar:{
        el: '.video-swiper',
        draggable: true,
        dragSize: 400
      }
    }
  }
}

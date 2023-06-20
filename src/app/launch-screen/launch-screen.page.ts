import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-launch-screen',
  templateUrl: './launch-screen.page.html',
  styleUrls: ['./launch-screen.page.scss'],
})
export class LaunchScreenPage implements OnInit {
  // @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  currentIndex = 0;
  btnTitle: string = null;

  public slidesArray: any = [
    {
      image: 'assets/imgs/slider-1.svg',
      headerText: 'Create your digital profile',
      subText: '',
    },
    {
      image: 'assets/imgs/slider-2.svg',
      headerText: 'Apply for the jobs at your desired hourly rates',
      subText: '',
    },
    {
      image: 'assets/imgs/slider-3.svg',
      headerText: 'Keep track of all your earnings',
      subText: '',
    }
  ];

  constructor(public router: Router, public storage: Storage) { }

  ngOnInit() {
    this.btnTitle = `Let's Start`;
  }

  getSlideIndex() {
    this.currentIndex = this.swiperRef?.nativeElement.swiper.activeIndex;
    // this.slides.getActiveIndex().then(
    //   (index) => {
    //     this.currentIndex = index;
    //   });
  }

  letsStart() {
    // this.slides.getActiveIndex().then(res => {
    //   if (res == 2) {
    //     this.router.navigateByUrl('onboarding/onboarding-phone-number');
    //   }
    // })
    // this.slides.slideNext();
    if (this.swiperRef?.nativeElement.swiper.activeIndex == 2) {
      this.storage.set('lanchScreensVisited', true);
      this.router.navigateByUrl('onboarding/onboarding-phone-number');
    }
    else {
      this.swiperRef?.nativeElement.swiper.slideTo(this.swiperRef?.nativeElement.swiper.activeIndex + 1)
    }
  }

  skip() {
    this.storage.set('lanchScreensVisited', true);
    this.router.navigateByUrl('onboarding/onboarding-phone-number');
  }
}

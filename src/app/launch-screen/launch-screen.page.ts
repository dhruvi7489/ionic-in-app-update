import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-launch-screen',
  templateUrl: './launch-screen.page.html',
  styleUrls: ['./launch-screen.page.scss'],
})
export class LaunchScreenPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
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

  constructor(public router: Router) { }

  ngOnInit() {
    this.btnTitle = `Let's Start`;
  }

  getSlideIndex() {
    this.slides.getActiveIndex().then(
      (index) => {
        this.currentIndex = index;
        // if (this.currentIndex == 3) {
        //   this.router.navigateByUrl('onboarding/onboarding-phone-number');
        // }
        // else {
        //   this.currentIndex = this.currentIndex + 1;
        //   this.slides.slideNext();
        // }
      });
  }

  letsStart() {
    this.slides.getActiveIndex().then(res => {
      if (res == 2) {
        this.router.navigateByUrl('onboarding/onboarding-phone-number');
      }
    })
    this.slides.slideNext();
  }

  skip() {
    this.router.navigateByUrl('onboarding/onboarding-phone-number');
  }
}

import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-header',
  templateUrl: './onboarding-header.page.html',
  styleUrls: ['./onboarding-header.page.scss'],
})
export class OnboardingHeaderPage implements OnInit {

  counter: any[] = [
    {
      active: false,
      page: "PhoneNumberPage",
      route: "/onboarding-phone-number"
    },
    {
      active: false,
      page: "OtpPage",
      route: "/onboarding-otp"
    },
    {
      active: false,
      page: "PersonalInfoPage",
      route: "/onboarding-personal-info"
    },
    {
      active: false,
      page: "ProfilePicturePage",
      route: "/onboarding-profile-picture"
    },
    {
      active: false,
      page: "JobTypePage",
      route: "/onboarding-job-type"
    }
  ];

  constructor(
    public onboardingService: OnboardingService,
    public location: Location,
    public router: Router
  ) { }


  ngOnInit() {
    this.activeLineSet();
  }

  activeLineSet() {
    this.counter.forEach((ele, index) => {
      if (ele.route == this.router.url) {
        for (let i = 0; i <= index; i++) {
          this.counter[i].active = true;
        }
      }
    })
  }

  back() {
    if (!this.onboardingService.showExperience) {
      this.location.back();
    } else {
      this.onboardingService.showExperience = false;
    }
    setTimeout(() => {
      this.activeLineSet();
    }, 500);
  }
}

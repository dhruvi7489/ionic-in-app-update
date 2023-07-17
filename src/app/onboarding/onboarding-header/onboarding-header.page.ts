import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';
import { OnboardingJobTypeService } from '../onboarding-job-type/onboarding-job-type.service';

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
      route: "/onboarding/onboarding-phone-number"
    },
    {
      active: false,
      page: "OtpPage",
      route: "/onboarding/onboarding-otp"
    },
    {
      active: false,
      page: "PersonalInfoPage",
      route: "/onboarding/onboarding-personal-info"
    },
    {
      active: false,
      page: "ProfilePicturePage",
      route: "/onboarding/onboarding-profile-picture"
    },
    {
      active: false,
      page: "JobTypePage",
      route: "/onboarding/onboarding-job-type"
    }
  ];
  @Input() headerTitle?: string = '';

  constructor(
    public onboardingService: OnboardingService,
    public location: Location,
    public router: Router,
    public onboardingJobTypeService: OnboardingJobTypeService
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

  async back() {
    if (!this.onboardingJobTypeService.showExperience) {
      this.location.back();
    } else {
      this.onboardingJobTypeService.showExperience = false;
      this.onboardingService.jobCategories = [];
      await this.onboardingService.getJobCategory();
      await this.onboardingService.checkCounterActive();
    }
    setTimeout(() => {
      this.activeLineSet();
    }, 500);
  }
}

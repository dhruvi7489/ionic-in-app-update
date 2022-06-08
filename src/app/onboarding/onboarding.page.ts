import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from './onboarding.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(
    public onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
    // this.onboardingService.isPhoneNumberPage = true;
    // this.onboardingService.activePage = "PhoneNumberPage";
    // this.onboardingService.isPersonalInfoPage = true;
    // this.onboardingService.activePage = "PersonalInfoPage";
    this.router.navigateByUrl('onboarding-phone-number');
  }

  // openOnboardingOtpPage(event) {
  //   this.onboardingService.phone_no = event;
  //   this.onboardingService.isPhoneNumberPage = false;
  //   this.onboardingService.isPersonalInfoPage = false;
  //   this.onboardingService.isProfilePicturePage = false;
  //   this.onboardingService.isJobTypePage = false;
  //   this.onboardingService.isOtpPage = true;
  //   this.onboardingService.activePage = "OtpPage";
  // }

  // openOnboardingPersonalInfoPage() {
  //   this.onboardingService.isOtpPage = false;
  //   this.onboardingService.isPhoneNumberPage = false;
  //   this.onboardingService.isProfilePicturePage = false;
  //   this.onboardingService.isJobTypePage = false;
  //   this.onboardingService.isPersonalInfoPage = true;
  //   this.onboardingService.activePage = "PersonalInfoPage";
  // }

  // openOnboardingProfilePicturePage() {
  //   this.onboardingService.isPersonalInfoPage = false;
  //   this.onboardingService.isOtpPage = false;
  //   this.onboardingService.isPhoneNumberPage = false;
  //   this.onboardingService.isJobTypePage = false;
  //   this.onboardingService.isProfilePicturePage = true;
  //   this.onboardingService.activePage = "ProfilePicturePage";
  // }

  // skipProfilePictureUploadPage() {
  //   this.onboardingService.isPersonalInfoPage = false;
  //   this.onboardingService.isOtpPage = false;
  //   this.onboardingService.isPhoneNumberPage = false;
  //   this.onboardingService.isProfilePicturePage = false;
  //   this.onboardingService.isJobTypePage = true;
  //   this.onboardingService.activePage = "JobTypePage";
  // }
}

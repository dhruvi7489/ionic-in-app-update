import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-profile-picture',
  templateUrl: './onboarding-profile-picture.page.html',
  styleUrls: ['./onboarding-profile-picture.page.scss'],
})
export class OnboardingProfilePicturePage implements OnInit {

  constructor(
    public onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.onboardingService.getPersonalInfo();
  }

  uploadPicture() {
    this.onboardingService.uploadProfilePicture();
  }

  skipProfilePictureUpload() {
    this.onboardingService.getProfileData();
    this.router.navigateByUrl('onboarding/onboarding-job-type');
  }

  openJobType() {
    this.onboardingService.getProfileData();
    this.router.navigateByUrl('onboarding/onboarding-job-type');
  }

  fileChange(event) {
    this.onboardingService.profile_picture = event.ngModelData
    this.onboardingService.uploadProfilePicture();
  }
}

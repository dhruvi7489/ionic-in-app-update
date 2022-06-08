import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-personal-info',
  templateUrl: './onboarding-personal-info.page.html',
  styleUrls: ['./onboarding-personal-info.page.scss'],
})
export class OnboardingPersonalInfoPage implements OnInit {

  disabled = true;
  @Output() openOnboardingProfilePicturePage = new EventEmitter();

  constructor(
    public onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
    this.onboardingService.getPersonalInfo();
  }

  gtFullName(event) {
    this.onboardingService.full_name = event.ngModelData;
  }

  getEmailAddress(event) {
    this.onboardingService.email_address = event.ngModelData;
    this.disable();
  }

  getDOB(event) {
    this.onboardingService.dob = event.ngModelData;
    this.disable();
  }

  getReferralCode(event) {
    this.onboardingService.referral_code = event.ngModelData;
  }

  openProfilePictureUploadPage() {
    // if (this.onboardingService.id == null) {
    //   this.onboardingService.savePersonalInfo();
    // } else {
    //   this.onboardingService.updatePersonalInfo();
    // }
    this.openOnboardingProfilePicturePage.emit();

    this.router.navigateByUrl('onboarding-profile-picture');
  }

  getGender(event) {
    this.onboardingService.gender = event.ngModelData;
    this.disable();
  }

  disable() {
    this.disabled = true;
    if (this.onboardingService.full_name && this.onboardingService.email_address && this.onboardingService.gender) {
      this.disabled = false;
    }
    return this.disabled;
  }

  onDateChange(event) {
    console.log(event)
  }
}

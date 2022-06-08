import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingPageRoutingModule } from './onboarding-routing.module';

import { OnboardingPage } from './onboarding.page';
import { OnboardingHeaderPageModule } from './onboarding-header/onboarding-header.module';
import { OnboardingPhoneNumberPageModule } from './onboarding-phone-number/onboarding-phone-number.module';
import { OnboardingOtpPageModule } from './onboarding-otp/onboarding-otp.module';
import { OnboardingPersonalInfoPageModule } from './onboarding-personal-info/onboarding-personal-info.module';
import { OnboardingProfilePicturePageModule } from './onboarding-profile-picture/onboarding-profile-picture.module';
import { OnboardingJobTypePageModule } from './onboarding-job-type/onboarding-job-type.module';
import { CustomButtonModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingPageRoutingModule,
    OnboardingHeaderPageModule,
    OnboardingPhoneNumberPageModule,
    OnboardingOtpPageModule,
    OnboardingPersonalInfoPageModule,
    OnboardingProfilePicturePageModule,
    OnboardingJobTypePageModule,
    CustomButtonModule
  ],
  declarations: [OnboardingPage]
})
export class OnboardingPageModule {}

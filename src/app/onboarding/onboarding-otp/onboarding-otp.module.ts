import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingOtpPageRoutingModule } from './onboarding-otp-routing.module';

import { OnboardingOtpPage } from './onboarding-otp.page';
import { CustomButtonModule, CustomInputModule, CustomOtpModule } from 'w4u-custom-components';
import { OnboardingHeaderPageModule } from '../onboarding-header/onboarding-header.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingOtpPageRoutingModule,
    CustomButtonModule,
    CustomInputModule,
    CustomOtpModule,
    OnboardingHeaderPageModule,
    NgOtpInputModule,
    DirectivesModule
  ],
  declarations: [OnboardingOtpPage],
  exports: [OnboardingOtpPage]
})
export class OnboardingOtpPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingPhoneNumberPageRoutingModule } from './onboarding-phone-number-routing.module';

import { OnboardingPhoneNumberPage } from './onboarding-phone-number.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { OnboardingHeaderPageModule } from '../onboarding-header/onboarding-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingPhoneNumberPageRoutingModule,
    CustomButtonModule,
    CustomInputModule,
    OnboardingHeaderPageModule,
  ],
  declarations: [OnboardingPhoneNumberPage],
  exports: [OnboardingPhoneNumberPage],
})
export class OnboardingPhoneNumberPageModule { }

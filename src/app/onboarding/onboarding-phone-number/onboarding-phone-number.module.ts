import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingPhoneNumberPageRoutingModule } from './onboarding-phone-number-routing.module';

import { OnboardingPhoneNumberPage } from './onboarding-phone-number.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { OnboardingHeaderPageModule } from '../onboarding-header/onboarding-header.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingPhoneNumberPageRoutingModule,
    CustomButtonModule,
    CustomInputModule,
    OnboardingHeaderPageModule,
    DirectivesModule
  ],
  declarations: [OnboardingPhoneNumberPage],
  exports: [OnboardingPhoneNumberPage],
})
export class OnboardingPhoneNumberPageModule { }

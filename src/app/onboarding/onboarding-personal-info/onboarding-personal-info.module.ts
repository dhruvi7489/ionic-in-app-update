import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingPersonalInfoPageRoutingModule } from './onboarding-personal-info-routing.module';

import { OnboardingPersonalInfoPage } from './onboarding-personal-info.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { OnboardingHeaderPageModule } from '../onboarding-header/onboarding-header.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingPersonalInfoPageRoutingModule,
    CustomButtonModule,
    CustomInputModule,
    OnboardingHeaderPageModule,
    DirectivesModule
  ],
  declarations: [OnboardingPersonalInfoPage],
  exports: [OnboardingPersonalInfoPage]
})
export class OnboardingPersonalInfoPageModule { }

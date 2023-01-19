import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingJobTypePageRoutingModule } from './onboarding-job-type-routing.module';

import { OnboardingJobTypePage } from './onboarding-job-type.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { OnboardingHeaderPageModule } from '../onboarding-header/onboarding-header.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingJobTypePageRoutingModule,
    CustomButtonModule,
    CustomInputModule,
    OnboardingHeaderPageModule,
    DirectivesModule
  ],
  declarations: [OnboardingJobTypePage],
  exports: [OnboardingJobTypePage]
})
export class OnboardingJobTypePageModule { }

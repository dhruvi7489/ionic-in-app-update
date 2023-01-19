import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingProfilePicturePageRoutingModule } from './onboarding-profile-picture-routing.module';

import { OnboardingProfilePicturePage } from './onboarding-profile-picture.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { OnboardingHeaderPageModule } from '../onboarding-header/onboarding-header.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingProfilePicturePageRoutingModule,
    CustomButtonModule,
    CustomInputModule,
    OnboardingHeaderPageModule,
    DirectivesModule
  ],
  declarations: [OnboardingProfilePicturePage],
  exports: [OnboardingProfilePicturePage]
})
export class OnboardingProfilePicturePageModule { }

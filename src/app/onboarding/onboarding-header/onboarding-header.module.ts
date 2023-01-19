import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingHeaderPageRoutingModule } from './onboarding-header-routing.module';

import { OnboardingHeaderPage } from './onboarding-header.page';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingHeaderPageRoutingModule,
    DirectivesModule
  ],
  declarations: [OnboardingHeaderPage],
  exports: [OnboardingHeaderPage]
})
export class OnboardingHeaderPageModule { }

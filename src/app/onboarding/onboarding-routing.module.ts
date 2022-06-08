import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingPage } from './onboarding.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardingPage
  },
  {
    path: 'onboarding-header',
    loadChildren: () => import('./onboarding-header/onboarding-header.module').then(m => m.OnboardingHeaderPageModule)
  },
  {
    path: 'onboarding-phone-number',
    loadChildren: () => import('./onboarding-phone-number/onboarding-phone-number.module').then(m => m.OnboardingPhoneNumberPageModule)
  },
  {
    path: 'onboarding-otp',
    loadChildren: () => import('./onboarding-otp/onboarding-otp.module').then(m => m.OnboardingOtpPageModule)
  },
  {
    path: 'onboarding-personal-info',
    loadChildren: () => import('./onboarding-personal-info/onboarding-personal-info.module').then(m => m.OnboardingPersonalInfoPageModule)
  },
  {
    path: 'onboarding-profile-picture',
    loadChildren: () => import('./onboarding-profile-picture/onboarding-profile-picture.module').then(m => m.OnboardingProfilePicturePageModule)
  },
  {
    path: 'onboarding-job-type',
    loadChildren: () => import('./onboarding-job-type/onboarding-job-type.module').then(m => m.OnboardingJobTypePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingPageRoutingModule { }

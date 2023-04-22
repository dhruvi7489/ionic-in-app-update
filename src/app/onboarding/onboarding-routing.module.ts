import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'onboarding-phone-number', pathMatch: 'full'
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

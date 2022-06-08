import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingOtpPage } from './onboarding-otp.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardingOtpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingOtpPageRoutingModule {}

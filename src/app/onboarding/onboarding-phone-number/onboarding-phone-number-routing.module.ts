import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingPhoneNumberPage } from './onboarding-phone-number.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardingPhoneNumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingPhoneNumberPageRoutingModule {}

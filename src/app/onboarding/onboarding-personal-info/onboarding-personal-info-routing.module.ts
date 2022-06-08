import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingPersonalInfoPage } from './onboarding-personal-info.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardingPersonalInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingPersonalInfoPageRoutingModule {}

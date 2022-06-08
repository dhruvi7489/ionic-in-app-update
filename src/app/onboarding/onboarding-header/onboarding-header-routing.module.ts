import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingHeaderPage } from './onboarding-header.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardingHeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingHeaderPageRoutingModule {}

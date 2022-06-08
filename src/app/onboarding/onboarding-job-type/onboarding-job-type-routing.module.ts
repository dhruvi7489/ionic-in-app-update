import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingJobTypePage } from './onboarding-job-type.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardingJobTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingJobTypePageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobFlowStepperPage } from './active-job-flow-stepper.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobFlowStepperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobFlowStepperPageRoutingModule {}

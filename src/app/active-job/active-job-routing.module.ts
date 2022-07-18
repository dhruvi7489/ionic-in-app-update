import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobPage } from './active-job.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobPage
  },
  {
    path: 'active-job-header',
    loadChildren: () => import('./active-job-header/active-job-header.module').then( m => m.ActiveJobHeaderPageModule)
  },
  {
    path: 'active-job-flow-stepper',
    loadChildren: () => import('./active-job-flow-stepper/active-job-flow-stepper.module').then( m => m.ActiveJobFlowStepperPageModule)
  },
  {
    path: 'active-job-summary',
    loadChildren: () => import('./active-job-summary/active-job-summary.module').then( m => m.ActiveJobSummaryPageModule)
  },
  {
    path: 'no-active-job',
    loadChildren: () => import('./no-active-job/no-active-job.module').then( m => m.NoActiveJobPageModule)
  },
  {
    path: 'active-job-location',
    loadChildren: () => import('./active-job-location/active-job-location.module').then( m => m.ActiveJobLocationPageModule)
  },
  {
    path: 'active-job-common-header',
    loadChildren: () => import('./active-job-common-header/active-job-common-header.module').then( m => m.ActiveJobCommonHeaderPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobPageRoutingModule {}

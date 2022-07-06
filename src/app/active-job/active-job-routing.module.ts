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
    path: 'photo-upload',
    loadChildren: () => import('./photo-upload/photo-upload.module').then( m => m.PhotoUploadPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobPageRoutingModule {}

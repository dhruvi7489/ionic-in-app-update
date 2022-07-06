import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableJobsPage } from './available-jobs.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableJobsPage
  },
  {
    path: 'available-jobs-list',
    loadChildren: () => import('./available-jobs-list/available-jobs-list.module').then(m => m.AvailableJobsListPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('../page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule)
  }
  // {
  //   path: 'available-job-details',
  //   loadChildren: () => import('./available-job-details/available-job-details.module').then( m => m.AvailableJobDetailsPageModule)
  // },
  // {
  //   path: 'available-jobs-header',
  //   loadChildren: () => import('./available-jobs-header/available-jobs-header.module').then( m => m.AvailableJobsHeaderPageModule)
  // },
  // {
  //   path: 'set-hourly-rate',
  //   loadChildren: () => import('./set-hourly-rate/set-hourly-rate.module').then( m => m.SetHourlyRatePageModule)
  // },
  // {
  //   path: 'job-application-modal',
  //   loadChildren: () => import('./job-application-modal/job-application-modal.module').then( m => m.JobApplicationModalPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableJobsPageRoutingModule { }

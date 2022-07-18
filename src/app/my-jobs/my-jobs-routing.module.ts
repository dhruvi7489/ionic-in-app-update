import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyJobsPage } from './my-jobs.page';

const routes: Routes = [
  {
    path: '',
    component: MyJobsPage
  },
  {
    path: 'my-jobs-header',
    loadChildren: () => import('./my-jobs-header/my-jobs-header.module').then( m => m.MyJobsHeaderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyJobsPageRoutingModule {}

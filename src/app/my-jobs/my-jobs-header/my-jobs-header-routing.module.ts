import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyJobsHeaderPage } from './my-jobs-header.page';

const routes: Routes = [
  {
    path: '',
    component: MyJobsHeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyJobsHeaderPageRoutingModule {}

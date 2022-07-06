import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableJobsListPage } from './available-jobs-list.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableJobsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableJobsListPageRoutingModule {}

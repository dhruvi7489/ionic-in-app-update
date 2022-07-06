import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableJobDetailsPage } from './available-job-details.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableJobDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableJobDetailsPageRoutingModule {}

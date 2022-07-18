import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoActiveJobPage } from './no-active-job.page';

const routes: Routes = [
  {
    path: '',
    component: NoActiveJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoActiveJobPageRoutingModule {}

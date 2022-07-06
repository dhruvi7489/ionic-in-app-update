import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobApplicationModalPage } from './job-application-modal.page';

const routes: Routes = [
  {
    path: '',
    component: JobApplicationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobApplicationModalPageRoutingModule {}

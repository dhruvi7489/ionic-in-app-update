import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobRatingPage } from './job-rating.page';

const routes: Routes = [
  {
    path: '',
    component: JobRatingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRatingPageRoutingModule {}

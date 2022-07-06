import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobSummaryPage } from './active-job-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobSummaryPageRoutingModule {}

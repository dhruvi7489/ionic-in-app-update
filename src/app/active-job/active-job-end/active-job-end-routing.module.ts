import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobEndPage } from './active-job-end.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobEndPageRoutingModule {}

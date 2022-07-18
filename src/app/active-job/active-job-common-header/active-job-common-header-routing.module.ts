import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobCommonHeaderPage } from './active-job-common-header.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobCommonHeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobCommonHeaderPageRoutingModule {}

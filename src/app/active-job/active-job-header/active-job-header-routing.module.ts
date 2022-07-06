import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobHeaderPage } from './active-job-header.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobHeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobHeaderPageRoutingModule {}

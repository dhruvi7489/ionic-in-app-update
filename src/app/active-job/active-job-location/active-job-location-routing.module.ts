import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobLocationPage } from './active-job-location.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobLocationPageRoutingModule {}

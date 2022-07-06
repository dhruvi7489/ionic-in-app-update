import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetHourlyRatePage } from './set-hourly-rate.page';

const routes: Routes = [
  {
    path: '',
    component: SetHourlyRatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetHourlyRatePageRoutingModule {}

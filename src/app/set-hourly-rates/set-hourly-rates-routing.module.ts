import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetHourlyRatesPage } from './set-hourly-rates.page';

const routes: Routes = [
  {
    path: '',
    component: SetHourlyRatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetHourlyRatesPageRoutingModule {}

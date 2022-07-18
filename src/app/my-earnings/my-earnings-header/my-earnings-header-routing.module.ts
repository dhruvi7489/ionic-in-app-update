import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEarningsHeaderPage } from './my-earnings-header.page';

const routes: Routes = [
  {
    path: '',
    component: MyEarningsHeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEarningsHeaderPageRoutingModule {}

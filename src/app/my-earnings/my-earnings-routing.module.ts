import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEarningsPage } from './my-earnings.page';

const routes: Routes = [
  {
    path: '',
    component: MyEarningsPage
  },
  {
    path: 'my-earnings-header',
    loadChildren: () => import('./my-earnings-header/my-earnings-header.module').then(m => m.MyEarningsHeaderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEarningsPageRoutingModule { }

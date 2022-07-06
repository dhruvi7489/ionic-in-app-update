import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InternetConnectionPage } from './internet-connection.page';

const routes: Routes = [
  {
    path: '',
    component: InternetConnectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternetConnectionPageRoutingModule {}

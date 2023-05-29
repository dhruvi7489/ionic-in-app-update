import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchScreen1Page } from './launch-screen1.page';

const routes: Routes = [
  {
    path: '',
    component: LaunchScreen1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaunchScreen1PageRoutingModule {}

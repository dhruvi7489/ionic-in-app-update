import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroductionVideoAddEditPage } from './introduction-video-add-edit.page';

const routes: Routes = [
  {
    path: '',
    component: IntroductionVideoAddEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroductionVideoAddEditPageRoutingModule {}

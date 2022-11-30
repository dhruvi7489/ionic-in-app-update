import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperienceAddEditPage } from './experience-add-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ExperienceAddEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExperienceAddEditPageRoutingModule {}

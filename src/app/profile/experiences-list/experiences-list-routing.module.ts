import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperiencesListPage } from './experiences-list.page';

const routes: Routes = [
  {
    path: '',
    component: ExperiencesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExperiencesListPageRoutingModule {}

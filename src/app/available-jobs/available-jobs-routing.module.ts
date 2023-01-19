import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AvailableJobsPage
  // },
  {
    path: 'available-jobs-list',
    loadChildren: () => import('./available-jobs-list/available-jobs-list.module').then(m => m.AvailableJobsListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableJobsPageRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'available-jobs',
        loadChildren: () => import('../available-jobs/available-jobs.module').then(m => m.AvailableJobsPageModule)
      },
      {
        path: 'active-job',
        loadChildren: () => import('../active-job/active-job.module').then(m => m.ActiveJobPageModule)
      },
      {
        path: 'my-earnings',
        loadChildren: () => import('../my-earnings/my-earnings.module').then(m => m.MyEarningsPageModule)
      },
      {
        path: 'my-jobs',
        loadChildren: () => import('../my-jobs/my-jobs.module').then(m => m.MyJobsPageModule)
      },
      // {
      //   path: '',
      //   redirectTo: '/tabs/available-jobs',
      //   pathMatch: 'full'
      // }
    ]
  },
  // {
  //   path: '',
  //   redirectTo: '/tabs/available-jobs',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'profile-header',
    loadChildren: () => import('./profile-header/profile-header.module').then(m => m.ProfileHeaderPageModule)
  },
  {
    path: 'profile-details',
    loadChildren: () => import('./profile-details/profile-details.module').then(m => m.ProfileDetailsPageModule)
  },
  {
    path: 'photos-videos',
    loadChildren: () => import('./photos-videos/photos-videos.module').then( m => m.PhotosVideosPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule { }

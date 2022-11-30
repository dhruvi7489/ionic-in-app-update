import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotosVideosPage } from './photos-videos.page';

const routes: Routes = [
  {
    path: '',
    component: PhotosVideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotosVideosPageRoutingModule {}

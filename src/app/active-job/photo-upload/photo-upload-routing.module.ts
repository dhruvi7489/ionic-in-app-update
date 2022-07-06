import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoUploadPage } from './photo-upload.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoUploadPageRoutingModule {}

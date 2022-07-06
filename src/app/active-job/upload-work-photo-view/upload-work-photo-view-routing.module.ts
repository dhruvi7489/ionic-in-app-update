import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadWorkPhotoViewPage } from './upload-work-photo-view.page';

const routes: Routes = [
  {
    path: '',
    component: UploadWorkPhotoViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadWorkPhotoViewPageRoutingModule {}

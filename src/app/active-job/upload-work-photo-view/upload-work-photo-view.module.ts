import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadWorkPhotoViewPageRoutingModule } from './upload-work-photo-view-routing.module';

import { UploadWorkPhotoViewPage } from './upload-work-photo-view.page';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadWorkPhotoViewPageRoutingModule,
    ActiveJobHeaderPageModule,
    CustomButtonModule,
    CustomInputModule
  ],
  declarations: [UploadWorkPhotoViewPage]
})
export class UploadWorkPhotoViewPageModule {}

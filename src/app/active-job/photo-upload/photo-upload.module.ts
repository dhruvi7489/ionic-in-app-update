import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoUploadPageRoutingModule } from './photo-upload-routing.module';

import { PhotoUploadPage } from './photo-upload.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoUploadPageRoutingModule,
    CustomButtonModule,
    CustomInputModule
  ],
  declarations: [PhotoUploadPage]
})
export class PhotoUploadPageModule { }

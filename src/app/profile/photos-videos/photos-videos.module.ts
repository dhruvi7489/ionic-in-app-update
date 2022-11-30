import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotosVideosPageRoutingModule } from './photos-videos-routing.module';

import { PhotosVideosPage } from './photos-videos.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { ProfileHeaderPageModule } from '../profile-header/profile-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotosVideosPageRoutingModule,
    ProfileHeaderPageModule,
    CustomButtonModule
  ],
  declarations: [PhotosVideosPage]
})
export class PhotosVideosPageModule { }

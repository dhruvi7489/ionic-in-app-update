import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ProfileHeaderPageModule } from './profile-header/profile-header.module';
import { ProfileDetailsPageModule } from './profile-details/profile-details.module';
import { PipesModule } from '../core/pipes/pipes.module';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ProfileHeaderPageModule,
    ProfileDetailsPageModule,
    PipesModule
  ],
  declarations: [ProfilePage],
  providers: [MediaCapture]
})
export class ProfilePageModule { }

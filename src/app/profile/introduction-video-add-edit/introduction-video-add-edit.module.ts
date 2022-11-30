import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroductionVideoAddEditPageRoutingModule } from './introduction-video-add-edit-routing.module';

import { IntroductionVideoAddEditPage } from './introduction-video-add-edit.page';
import { ProfileHeaderPageModule } from '../profile-header/profile-header.module';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// import '@teamhive/capacitor-video-recorder';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroductionVideoAddEditPageRoutingModule,
    ProfileHeaderPageModule,
    CustomButtonModule,
    CustomInputModule,
    PipesModule
  ],
  declarations: [IntroductionVideoAddEditPage],
})
export class IntroductionVideoAddEditPageModule { }

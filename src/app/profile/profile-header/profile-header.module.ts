import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileHeaderPageRoutingModule } from './profile-header-routing.module';

import { ProfileHeaderPage } from './profile-header.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileHeaderPageRoutingModule,
    CustomButtonModule,
    CustomInputModule
  ],
  declarations: [ProfileHeaderPage],
  exports: [ProfileHeaderPage]
})
export class ProfileHeaderPageModule { }

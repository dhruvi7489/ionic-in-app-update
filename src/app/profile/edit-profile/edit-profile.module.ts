import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';
import { ProfileHeaderPageModule } from '../profile-header/profile-header.module';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule,
    ProfileHeaderPageModule,
    CustomButtonModule,
    CustomInputModule
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule { }

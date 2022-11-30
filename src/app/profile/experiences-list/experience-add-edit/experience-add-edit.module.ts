import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperienceAddEditPageRoutingModule } from './experience-add-edit-routing.module';

import { ExperienceAddEditPage } from './experience-add-edit.page';
import { ProfileHeaderPageModule } from '../../profile-header/profile-header.module';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExperienceAddEditPageRoutingModule,
    ProfileHeaderPageModule,
    CustomButtonModule,
    CustomInputModule
  ],
  declarations: [ExperienceAddEditPage]
})
export class ExperienceAddEditPageModule { }

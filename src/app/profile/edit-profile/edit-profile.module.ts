import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';
import { ProfileHeaderPageModule } from '../profile-header/profile-header.module';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { DirectivesModule } from 'src/app/directives/directives.module';

const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule,
    ProfileHeaderPageModule,
    CustomButtonModule,
    CustomInputModule,
    DirectivesModule
  ],
  declarations: [EditProfilePage],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: MY_FORMATS
    },
  ]
})
export class EditProfilePageModule { }

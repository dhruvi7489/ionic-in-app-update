import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpPageRoutingModule } from './otp-routing.module';

import { OtpPage } from './otp.page';
import { CustomButtonModule, CustomInputModule, CustomOtpModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpPageRoutingModule,
    ReactiveFormsModule,
    CustomButtonModule,
    CustomInputModule,
    CustomOtpModule
  ],
  declarations: [OtpPage]
})
export class OtpPageModule {}

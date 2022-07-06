import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPaymentPageRoutingModule } from './edit-payment-routing.module';

import { EditPaymentPage } from './edit-payment.page';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPaymentPageRoutingModule,
    ActiveJobHeaderPageModule,
    CustomButtonModule,
    CustomInputModule
  ],
  declarations: [EditPaymentPage]
})
export class EditPaymentPageModule {}

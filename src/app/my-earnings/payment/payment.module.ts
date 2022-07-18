import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';
import { MyEarningsHeaderPageModule } from '../my-earnings-header/my-earnings-header.module';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPageRoutingModule,
    MyEarningsHeaderPageModule,
    CustomButtonModule,
    CustomInputModule,
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}

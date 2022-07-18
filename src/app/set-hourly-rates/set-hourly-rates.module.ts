import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetHourlyRatesPageRoutingModule } from './set-hourly-rates-routing.module';

import { SetHourlyRatesPage } from './set-hourly-rates.page';
import { CustomButtonModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetHourlyRatesPageRoutingModule,
    CustomButtonModule
  ],
  declarations: [SetHourlyRatesPage]
})
export class SetHourlyRatesPageModule {}

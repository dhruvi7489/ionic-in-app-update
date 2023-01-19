import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetHourlyRatesPageRoutingModule } from './set-hourly-rates-routing.module';

import { SetHourlyRatesPage } from './set-hourly-rates.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetHourlyRatesPageRoutingModule,
    CustomButtonModule,
    DirectivesModule
  ],
  declarations: [SetHourlyRatesPage]
})
export class SetHourlyRatesPageModule { }

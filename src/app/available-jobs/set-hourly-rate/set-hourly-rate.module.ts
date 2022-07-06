import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetHourlyRatePageRoutingModule } from './set-hourly-rate-routing.module';

import { SetHourlyRatePage } from './set-hourly-rate.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { AvailableJobsHeaderPageModule } from '../available-jobs-header/available-jobs-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetHourlyRatePageRoutingModule,
    AvailableJobsHeaderPageModule,
    CustomButtonModule
  ],
  declarations: [SetHourlyRatePage]
})
export class SetHourlyRatePageModule {}

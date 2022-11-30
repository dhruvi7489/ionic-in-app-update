import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobLocationPageRoutingModule } from './active-job-location-routing.module';

import { ActiveJobLocationPage } from './active-job-location.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';
import { ActiveJobCommonHeaderPageModule } from '../active-job-common-header/active-job-common-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobLocationPageRoutingModule,
    CustomButtonModule,
    ActiveJobHeaderPageModule,
    ActiveJobCommonHeaderPageModule
  ],
  declarations: [ActiveJobLocationPage]
})
export class ActiveJobLocationPageModule {}

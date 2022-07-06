import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableJobDetailsPageRoutingModule } from './available-job-details-routing.module';

import { AvailableJobDetailsPage } from './available-job-details.page';
import { AvailableJobsHeaderPageModule } from '../available-jobs-header/available-jobs-header.module';
import { CustomButtonModule } from 'w4u-custom-components';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableJobDetailsPageRoutingModule,
    AvailableJobsHeaderPageModule,
    CustomButtonModule,
    PipesModule
  ],
  declarations: [AvailableJobDetailsPage]
})
export class AvailableJobDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobPageRoutingModule } from './active-job-routing.module';

import { ActiveJobPage } from './active-job.page';
import { ActiveJobHeaderPageModule } from './active-job-header/active-job-header.module';
import { CustomButtonModule } from 'w4u-custom-components';
import { PipesModule } from '../core/pipes/pipes.module';
// import { ActiveJobFlowStepperPageModule } from './active-job-flow-stepper/active-job-flow-stepper.module';
import { ActiveJobSummaryPageModule } from './active-job-summary/active-job-summary.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobPageRoutingModule,
    ActiveJobHeaderPageModule,
    CustomButtonModule,
    PipesModule,
    // ActiveJobFlowStepperPageModule,
    ActiveJobSummaryPageModule
  ],
  declarations: [ActiveJobPage]
})
export class ActiveJobPageModule { }

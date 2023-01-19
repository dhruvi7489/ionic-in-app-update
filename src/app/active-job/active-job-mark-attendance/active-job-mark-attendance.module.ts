import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobMarkAttendancePageRoutingModule } from './active-job-mark-attendance-routing.module';

import { ActiveJobMarkAttendancePage } from './active-job-mark-attendance.page';
import { ActiveJobCommonHeaderPageModule } from '../active-job-common-header/active-job-common-header.module';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';
import { CustomButtonModule } from 'w4u-custom-components';
import { ActiveJobFlowStepperPageModule } from '../active-job-flow-stepper/active-job-flow-stepper.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobMarkAttendancePageRoutingModule,
    CustomButtonModule,
    ActiveJobHeaderPageModule,
    ActiveJobCommonHeaderPageModule,
    ActiveJobFlowStepperPageModule,
    DirectivesModule
  ],
  declarations: [ActiveJobMarkAttendancePage]
})
export class ActiveJobMarkAttendancePageModule { }

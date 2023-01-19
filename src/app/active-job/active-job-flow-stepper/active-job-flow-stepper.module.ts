import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobFlowStepperPageRoutingModule } from './active-job-flow-stepper-routing.module';

import { ActiveJobFlowStepperPage } from './active-job-flow-stepper.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobFlowStepperPageRoutingModule,
    PipesModule,
    DirectivesModule
  ],
  declarations: [ActiveJobFlowStepperPage],
  exports: [ActiveJobFlowStepperPage]
})
export class ActiveJobFlowStepperPageModule { }

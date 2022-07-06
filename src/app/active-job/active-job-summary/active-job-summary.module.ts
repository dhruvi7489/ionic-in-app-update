import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobSummaryPageRoutingModule } from './active-job-summary-routing.module';

import { ActiveJobSummaryPage } from './active-job-summary.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobSummaryPageRoutingModule,
    CustomButtonModule,
    PipesModule
  ],
  declarations: [ActiveJobSummaryPage],
  exports: [ActiveJobSummaryPage]
})
export class ActiveJobSummaryPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobSummaryPageRoutingModule } from './active-job-summary-routing.module';

import { ActiveJobSummaryPage } from './active-job-summary.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';
import { ActiveJobCommonHeaderPageModule } from '../active-job-common-header/active-job-common-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobSummaryPageRoutingModule,
    CustomButtonModule,
    PipesModule,
    ActiveJobHeaderPageModule,
    ActiveJobCommonHeaderPageModule
  ],
  declarations: [ActiveJobSummaryPage],
  exports: [ActiveJobSummaryPage]
})
export class ActiveJobSummaryPageModule { }

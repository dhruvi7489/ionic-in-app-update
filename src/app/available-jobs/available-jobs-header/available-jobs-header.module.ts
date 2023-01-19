import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableJobsHeaderPageRoutingModule } from './available-jobs-header-routing.module';

import { AvailableJobsHeaderPage } from './available-jobs-header.page';
import { CustomInputModule } from 'w4u-custom-components';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableJobsHeaderPageRoutingModule,
    CustomInputModule,
    DirectivesModule
  ],
  declarations: [AvailableJobsHeaderPage],
  exports: [AvailableJobsHeaderPage]
})
export class AvailableJobsHeaderPageModule { }

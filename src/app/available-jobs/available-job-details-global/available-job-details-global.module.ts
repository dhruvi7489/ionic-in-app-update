import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableJobDetailsGlobalComponent } from './available-job-details-global.component';
import { AvailableJobDetailsGlobalPageRoutingModule } from './available-job-details-global-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvailableJobsHeaderPageModule } from '../available-jobs-header/available-jobs-header.module';
import { CustomButtonModule } from 'w4u-custom-components';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [AvailableJobDetailsGlobalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableJobDetailsGlobalPageRoutingModule,
    AvailableJobsHeaderPageModule,
    CustomButtonModule,
    PipesModule,
    DirectivesModule
  ]
})
export class AvailableJobDetailsGlobalModule { }

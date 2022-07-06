import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobRatingPageRoutingModule } from './job-rating-routing.module';

import { JobRatingPage } from './job-rating.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobRatingPageRoutingModule,
    ActiveJobHeaderPageModule,
    CustomButtonModule,
    CustomInputModule
  ],
  declarations: [JobRatingPage]
})
export class JobRatingPageModule {}

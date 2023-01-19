import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoActiveJobPageRoutingModule } from './no-active-job-routing.module';

import { NoActiveJobPage } from './no-active-job.page';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';
import { CustomButtonModule } from 'w4u-custom-components';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoActiveJobPageRoutingModule,
    ActiveJobHeaderPageModule,
    CustomButtonModule,
    DirectivesModule
  ],
  declarations: [NoActiveJobPage]
})
export class NoActiveJobPageModule { }

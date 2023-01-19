import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobEndPageRoutingModule } from './active-job-end-routing.module';

import { ActiveJobEndPage } from './active-job-end.page';
import { ActiveJobCommonHeaderPageModule } from '../active-job-common-header/active-job-common-header.module';
import { ActiveJobHeaderPageModule } from '../active-job-header/active-job-header.module';
import { CustomButtonModule } from 'w4u-custom-components';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobEndPageRoutingModule,
    ActiveJobHeaderPageModule,
    ActiveJobCommonHeaderPageModule,
    CustomButtonModule,
    DirectivesModule
  ],
  declarations: [ActiveJobEndPage]
})
export class ActiveJobEndPageModule { }

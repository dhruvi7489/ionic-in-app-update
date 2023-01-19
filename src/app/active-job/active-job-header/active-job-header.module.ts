import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobHeaderPageRoutingModule } from './active-job-header-routing.module';

import { ActiveJobHeaderPage } from './active-job-header.page';
import { CustomInputModule } from 'w4u-custom-components';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobHeaderPageRoutingModule,
    CustomInputModule,
    DirectivesModule
  ],
  declarations: [ActiveJobHeaderPage],
  exports: [ActiveJobHeaderPage]
})
export class ActiveJobHeaderPageModule { }

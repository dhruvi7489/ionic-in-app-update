import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobCommonHeaderPageRoutingModule } from './active-job-common-header-routing.module';

import { ActiveJobCommonHeaderPage } from './active-job-common-header.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobCommonHeaderPageRoutingModule
  ],
  declarations: [ActiveJobCommonHeaderPage]
})
export class ActiveJobCommonHeaderPageModule {}

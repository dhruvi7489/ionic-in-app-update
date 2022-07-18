import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobLocationPageRoutingModule } from './active-job-location-routing.module';

import { ActiveJobLocationPage } from './active-job-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobLocationPageRoutingModule
  ],
  declarations: [ActiveJobLocationPage]
})
export class ActiveJobLocationPageModule {}

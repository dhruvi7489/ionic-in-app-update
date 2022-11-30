import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyJobsPageRoutingModule } from './my-jobs-routing.module';

import { MyJobsPage } from './my-jobs.page';
import { MyJobsHeaderPageModule } from './my-jobs-header/my-jobs-header.module';
import { PipesModule } from '../core/pipes/pipes.module';
import { CustomButtonModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyJobsPageRoutingModule,
    MyJobsHeaderPageModule,
    PipesModule,
    CustomButtonModule
  ],
  declarations: [MyJobsPage]
})
export class MyJobsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableJobsListPageRoutingModule } from './available-jobs-list-routing.module';

import { AvailableJobsListPage } from './available-jobs-list.page';
import { AvailableJobsHeaderPageModule } from '../available-jobs-header/available-jobs-header.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableJobsListPageRoutingModule,
    AvailableJobsHeaderPageModule,
    PipesModule
  ],
  declarations: [AvailableJobsListPage]
})
export class AvailableJobsListPageModule {}

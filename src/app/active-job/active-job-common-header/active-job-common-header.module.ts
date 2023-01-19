import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveJobCommonHeaderPageRoutingModule } from './active-job-common-header-routing.module';

import { ActiveJobCommonHeaderPage } from './active-job-common-header.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveJobCommonHeaderPageRoutingModule,
    PipesModule,
    DirectivesModule
  ],
  declarations: [ActiveJobCommonHeaderPage],
  exports: [ActiveJobCommonHeaderPage]
})
export class ActiveJobCommonHeaderPageModule { }

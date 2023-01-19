import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyJobsHeaderPageRoutingModule } from './my-jobs-header-routing.module';

import { MyJobsHeaderPage } from './my-jobs-header.page';
import { CustomInputModule } from 'w4u-custom-components';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyJobsHeaderPageRoutingModule,
    CustomInputModule,
    DirectivesModule
  ],
  declarations: [MyJobsHeaderPage],
  exports: [MyJobsHeaderPage]
})
export class MyJobsHeaderPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEarningsHeaderPageRoutingModule } from './my-earnings-header-routing.module';

import { MyEarningsHeaderPage } from './my-earnings-header.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEarningsHeaderPageRoutingModule
  ],
  declarations: [MyEarningsHeaderPage],
  exports: [MyEarningsHeaderPage]
})
export class MyEarningsHeaderPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEarningsPageRoutingModule } from './my-earnings-routing.module';

import { MyEarningsPage } from './my-earnings.page';
import { MyEarningsHeaderPageModule } from './my-earnings-header/my-earnings-header.module';
import { PipesModule } from '../core/pipes/pipes.module';
import { CustomButtonModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEarningsPageRoutingModule,
    MyEarningsHeaderPageModule,
    PipesModule,
    CustomButtonModule
  ],
  declarations: [MyEarningsPage]
})
export class MyEarningsPageModule {}

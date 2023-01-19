import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WithdrawPageRoutingModule } from './withdraw-routing.module';

import { WithdrawPage } from './withdraw.page';
import { CustomButtonModule, CustomInputModule } from 'w4u-custom-components';
import { MyEarningsHeaderPageModule } from '../my-earnings-header/my-earnings-header.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WithdrawPageRoutingModule,
    MyEarningsHeaderPageModule,
    CustomButtonModule,
    CustomInputModule,
    DirectivesModule
  ],
  declarations: [WithdrawPage]
})
export class WithdrawPageModule { }

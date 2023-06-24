import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WithdrawalResponseModalPageRoutingModule } from './withdrawal-response-modal-routing.module';

import { WithdrawalResponseModalPage } from './withdrawal-response-modal.page';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CustomButtonModule } from 'w4u-custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WithdrawalResponseModalPageRoutingModule,
    DirectivesModule,
    CustomButtonModule
  ],
  declarations: [WithdrawalResponseModalPage],
  exports: [WithdrawalResponseModalPage]
})
export class WithdrawalResponseModalPageModule { }

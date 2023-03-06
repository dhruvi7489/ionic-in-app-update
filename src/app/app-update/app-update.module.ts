import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppUpdatePageRoutingModule } from './app-update-routing.module';

import { AppUpdatePage } from './app-update.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppUpdatePageRoutingModule,
    CustomButtonModule,
    DirectivesModule
  ],
  declarations: [AppUpdatePage]
})
export class AppUpdatePageModule { }

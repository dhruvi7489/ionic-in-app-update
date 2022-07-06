import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InternetConnectionPageRoutingModule } from './internet-connection-routing.module';

import { InternetConnectionPage } from './internet-connection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InternetConnectionPageRoutingModule
  ],
  declarations: [InternetConnectionPage],
  exports: [InternetConnectionPage]
})
export class InternetConnectionPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaunchScreen1PageRoutingModule } from './launch-screen1-routing.module';

import { LaunchScreen1Page } from './launch-screen1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaunchScreen1PageRoutingModule
  ],
  declarations: [LaunchScreen1Page]
})
export class LaunchScreen1PageModule {}

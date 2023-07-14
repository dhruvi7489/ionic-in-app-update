import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaunchScreenPageRoutingModule } from './launch-screen-routing.module';

import { LaunchScreenPage } from './launch-screen.page';
import { CustomButtonModule } from 'w4u-custom-components';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaunchScreenPageRoutingModule,
    CustomButtonModule,
    DirectivesModule
  ],
  declarations: [LaunchScreenPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LaunchScreenPageModule { }

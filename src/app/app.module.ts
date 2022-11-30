import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    LaunchNavigator,
    // FCM,
    SplashScreen,
    NavParams,
    Facebook,
    Storage
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

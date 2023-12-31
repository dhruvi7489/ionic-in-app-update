import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Network } from '@ionic-native/network/ngx';
import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(
      {
        swipeBackEnabled: false // close swipe back event in IOS
      }
    ),
    AppRoutingModule,
    HttpClientModule,
    NgOtpInputModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    LaunchNavigator,
    // FCM,
    // SplashScreen,
    NavParams,
    Facebook,
    Storage,
    AppVersion,
    AppUpdate,
    LocationAccuracy,
    InAppBrowser
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

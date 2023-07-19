import { Component, NgZone, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ActionSheetController, AlertController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Storage } from '@ionic/storage';
import { Capacitor } from '@capacitor/core';
import { AppUpdateService } from './core/services/app-update.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

declare var UXCam: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor(
    public platform: Platform,
    public router: Router,
    public navParams: NavParams,
    // public locationService: LocationService,
    private alertCtrl: AlertController,
    public storage: Storage,
    private zone: NgZone,
    // public pushNotificationService: PushNotificationService,
    public appUpdateService: AppUpdateService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    private deviceService: DeviceDetectorService

  ) {

    let deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log("deviceInfo--", deviceInfo);
    console.log("isMobile-----", isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log("isTablet----", isTablet);  // returns if the device us a tablet (iPad etc)
    console.log("isDesktopDevice----", isDesktopDevice); // returns if the app is running on a Desktop browser.

    SplashScreen.show({
      autoHide: true,
    });

    this.initializeApp();
  }

  ngOnInit() {
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      if (Capacitor.getPlatform() !== 'web') {

        // Statusbar background and icons color change
        StatusBar.setBackgroundColor({
          color: '#ffffff'
        });
        StatusBar.setStyle({
          style: Style.Light
        })

        // Block Landscape mode
        if (Capacitor.getPlatform() == 'android') {
          window.screen.orientation.lock('portrait');
        }

        // App Update Check
        this.appUpdateService.checkAppUpdate();
      }
    })
  }
}

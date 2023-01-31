import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AlertController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { NetworkService } from './core/services/network.service';
// import { PushNotificationService } from './core/services/push-notifications.service';
import { CommonProvider } from './core/common';
import { Apiurl } from './core/route';
import { AvailableJobsService } from './available-jobs/available-jobs.service';
import { App, AppState, RestoredListenerEvent, URLOpenListenerEvent } from '@capacitor/app';
import { LocationService } from './core/services/location.service';
import { Storage } from '@ionic/storage';
import { Capacitor } from '@capacitor/core';
import { AppUpdateService } from './core/services/app-update.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LoadingService } from './core/services/loading.service';

declare var UXCam: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent {

  // public pushPayload: INotificationPayload = null;

  constructor(
    public platform: Platform,
    public networkService: NetworkService,
    public router: Router,
    public commonProvider: CommonProvider,
    public availableJobsService: AvailableJobsService,
    public navParams: NavParams,
    public locationService: LocationService,
    private alertCtrl: AlertController,
    public storage: Storage,
    private zone: NgZone,
    // public pushNotificationService: PushNotificationService,
    public appUpdateService: AppUpdateService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingService: LoadingService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    console.log(Capacitor.getPlatform())

  }

  async initializeApp() {
    // Deep linking
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log("event------", event)
      // this.zone.run(() => {
      //   console.log("zone run.........")
      //   // Example url: https://beerswift.app/tabs/tab2
      //   // slug = /tabs/tab2
      //   const slug = event.url.split("com.hour4u.app").pop();
      //   console.log("slug---", slug)
      //   if (slug) {
      //     this.router.navigateByUrl(slug);
      //   }
      //   // If no match, do nothing - let regular routing
      //   // logic take over
      // });

      this.zone.run(() => {
        // const domain = 'com.hour4u.app';
        const domain = 'appuat.hour4u.com';
        const pathArray = event.url.split(domain);
        // The pathArray is now like ['https://devdactic.com', '/details/42']
        console.log("pathArray-----", pathArray)
        // Get the last element with pop()
        const appPath = pathArray.pop();
        console.log("appPath+++++++++++", appPath)
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      });
    });

    App.addListener('appStateChange', (event: AppState) => {
      console.log("appp state change----------", event)
    });

    App.addListener('appRestoredResult', (data: RestoredListenerEvent) => {
      console.log('Restored state:', data);
    });

    this.platform.ready().then(async () => {
      if (Capacitor.getPlatform() !== 'web') {
        await PushNotifications.requestPermissions().then(async (result) => {
          if (result.receive === 'granted') {
            // Register with Apple / Google to receive push via APNS/FCM
            await PushNotifications.register();
          } else {
            // Show some error
            console.log(" error ", result)
          }
        });

        // On success, we should be able to receive notifications
        await PushNotifications.addListener('registration', async (token) => {
          console.info('Registration token: ', token.value);
          this.storage.set('FCMToken', token.value);
          await this.updateToken(token.value)
        });

        // Some issue with our setup and push will not work
        await PushNotifications.addListener('registrationError', (error: any) => {
          console.log('Error on registration: ' + JSON.stringify(error));
        });

        // Show us the notification payload if the app is open on our device
        await PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
            // this.notification = notification;
            console.log('Push received: ', notification);
          }
        );

        // Method called when tapping on a notification
        await PushNotifications.addListener('pushNotificationActionPerformed',
          async (notification: ActionPerformed) => {
            console.log('Push action performed---', notification);
            // this.notification = notification?.notification;
            await this.performRedirectionOnNotification(notification);
          }
        );
      }

      if (Capacitor.getPlatform() !== 'web') {
        // Splash screen duration
        await SplashScreen.show({
          showDuration: 1500,
          autoHide: true,
        });
        // Statusbar background and icons color change
        StatusBar.setBackgroundColor({
          color: '#ffffff'
        });
        StatusBar.setStyle({
          style: Style.Light
        })

        // Block Landscape mode
        window.screen.orientation.lock('portrait');
      }

      // Push notification call
      if (Capacitor.getPlatform() !== 'web') {
        // this.pushNotificationService.initPushNotification();
      }

      // Check current internet connection Status
      this.networkService.getInternetConnectionStatus();

      // Network connection change
      this.networkService.initializeNetworkEvents();

      // Device Back button logic
      App.addListener('backButton', ({ canGoBack }) => {
        console.log("canGoBack-", canGoBack)
        this.modalCtrl.getTop().then((res: any) => {
          if (res) {
            this.modalCtrl.dismiss();
          } else {
            if (this.router.url.includes('/tabs')) {
              let alert = this.alertCtrl.create({
                header: 'Exit',
                message: 'Are you sure you want to exit app?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Exit App',
                    handler: () => {
                      App.exitApp();
                    }
                  }
                ]
              });
              alert.then(res => {
                res.present();
              });
            } else {
              window.history.back();
            }
          }
        }).catch((err: any) => {
          console.log(err);
        })
      });

      // App Update Check
      if (Capacitor.getPlatform() !== 'web') {
        // this.appUpdateService.checkAppUpdate();
      }

      //UX-CAM Setup
      if (Capacitor.getPlatform() !== 'web') {
        UXCam.optIntoSchematicRecordings();//To enable session video recording on iOS 
        const configuration = {
          userAppKey: Apiurl.UxCamAppKey,
          enableAutomaticScreenNameTagging: true,
          enableImprovedScreenCapture: true,
        }
        UXCam.startWithConfiguration(configuration);
      }

      // SMS send
      // const writeToClipboard = async () => {
      //   await Clipboard.write({
      //     string: "Hello World!"
      //   });
      // };
      // console.log("calllllllllllllllllllllllll===============", Clipboard.read())
      // const checkClipboard = async () => {
      // const { type, value } = await Clipboard.read();

      // console.log(`Got ${type} from clipboard: ${value}`);
      // };

    })
  }


  // Update device token
  async updateToken(token) {
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    if (loginUserMobileNo != null) {
      let obj = {
        deviceToken: token,
        mobile: loginUserMobileNo
      }
      await this.commonProvider.PutMethod(Apiurl.UpdateToken, obj).then(async (res: any) => {
      }).catch(err => {
        console.log(err);
      })
    }
  }

  // Redirect on particular page click on notification
  // Perform action on notification
  async performRedirectionOnNotification(notification) {
    console.log("notification---------", notification)
    setTimeout(() => {
      this.loadingService.dismiss();
      if (notification?.notification && notification?.notification?.data) {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", notification?.notification?.data);
        if (notification?.notification?.data?.title == 'Profile Approved') {
          this.router.navigateByUrl('set-hourly-rate');
        }
        if (notification?.notification?.data?.title == 'Job Application Actioned') {
          this.router.navigateByUrl('tabs/my-jobs');
        }
        if (notification?.notification?.data?.title == 'Job Reminder') {
          this.router.navigateByUrl('tabs/active-job');
        }
        if (notification?.notification?.data?.title == 'We found you a new job') {
          this.router.navigateByUrl("available-job-details/" + notification?.notification?.data?.jobId)
        }
      }
    }, 2500);
  }
}

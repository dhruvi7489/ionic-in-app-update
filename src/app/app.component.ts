import { Component, NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AlertController, IonRouterOutlet, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { NetworkService } from './services/network.service';
import { PushNotificationService } from './services/push-notifications.service';
// import { FCM } from '@capacitor-community/fcm';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
// import { INotificationPayload } from 'cordova-plugin-fcm-with-dependecy-updated/typings/INotificationPayload';
import { CommonProvider } from './core/common';
import { Apiurl } from './core/route';
import { AvailableJobsService } from './available-jobs/available-jobs.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { LocationService } from './services/location.service';
import { Storage } from '@ionic/storage';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { AppUpdateService } from './services/app-update.service';

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
    // public fcm: FCM,
    public splashScreen: SplashScreen,
    public commonProvider: CommonProvider,
    public availableJobsService: AvailableJobsService,
    public navParams: NavParams,
    public locationService: LocationService,
    private alertCtrl: AlertController,
    public storage: Storage,
    private zone: NgZone,
    // private routerOutlet: IonRouterOutlet
    // public pushNotificationService: PushNotificationService,
    public appUpdateService: AppUpdateService,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    console.log(isPushNotificationsAvailable, PushNotifications)
    console.log(Capacitor.getPlatform())
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }

  }
  private registerPush() {
    // PushNotifications.requestPermissions().then(permission => {
    //   console.log("callll", permission)
    //   if (permission.receive === 'granted') {
    //     PushNotifications.createChannel({
    //       id: "testchannel1",
    //       name: "testchannel1",
    //       description: "Very urgent message alert",
    //       sound: "alert",
    //       importance: 5,
    //       visibility: -1,
    //       lights: true,
    //       lightColor: "#eee",
    //       vibration: true
    //     }
    //     ).then(channel => {
    //       console.log('channel created', channel);
    //       PushNotifications.register().then((res: any) => {
    //         console.log("res----", res)
    //       }).catch((err: any) => {
    //         console.log("err-------", err)
    //       });
    //       PushNotifications.addListener('registration', (token) => {
    //         console.log(token, "++++++++++++++");
    //       });
    //     }).catch(err => {
    //       console.log('channel created error', err)
    //     })
    //   }
    //   else {
    //     // If permission is not granted
    //   }
    // });


    PushNotifications.requestPermissions().then((permission) => {
      console.log("permission----", permission)
      if (permission.receive == 'granted') {
        console.log("calllllllllllll")
        // Register with Apple / Google to receive push via APNS/FCM
        // PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        console.log('My token: ' + JSON.stringify(token));
        // this.pushNotificationToken = JSON.stringify(token.value);
      }
    ).catch(err => {
      console.log('error My token: ' + err);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log(notification);
        alert(notification.body)
      }
    );
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
      }
    );


    // PushNotifications.addListener('registration', (token) => {
    //   console.log(token, "++++++++++++++---------");
    // });
    // PushNotifications.addListener('registrationError', (err) => {
    //   console.log(err);
    // });
    // PushNotifications.addListener('pushNotificationReceived', (notifications) => {
    //   console.log(notifications);
    // });

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
        const domain = 'com.hour4u.app';

        const pathArray = event.url.split(domain);
        // The pathArray is now like ['https://devdactic.com', '/details/42']

        // Get the last element with pop()
        const appPath = pathArray.pop();
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      });
    });


    this.platform.ready().then(async () => {
      // Statusbar background and icons color change
      StatusBar.setBackgroundColor({
        color: '#ffffff'
      });
      StatusBar.setStyle({
        style: Style.Light
      })

      // Block Landscape mode
      window.screen.orientation.lock('portrait');

      // Check current internet connection Status
      this.networkService.getInternetConnectionStatus();

      // Network connection change
      this.networkService.initializeNetworkEvents();

      // Location acccess permission
      // if (!this.locationService.locationPermissionGranted) {
      //   console.log("%%%%%%%")
      //   await this.locationService.requestLocationPermission(false);
      // }

      // Device Back button logic
      App.addListener('backButton', ({ canGoBack }) => {
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
          console.log(err)
        })
      });


      // App Update Check
      this.appUpdateService.checkAppUpdate();



      // Notifications 

      // this.setupFCM();
      /** FCM Start */
      // this.fcm.createNotificationChannel({
      //   id: "testchannel1", // required
      //   name: "testchannel1", // required
      //   description: "Very urgent message alert",
      //   importance: "high", // https://developer.android.com/guide/topics/ui/notifiers/notifications#importance
      //   visibility: "public", // https://developer.android.com/training/notify-user/build-notification#lockscreenNotification
      //   sound: "alert_sound", // In the "alert_sound" example, the file should located as resources/raw/alert_sound.mp3
      //   lights: false, // enable lights for notifications
      //   vibration: true // enable vibration for notifications
      // }).then(channel => {
      //   console.log('channel created', channel);
      // }).catch(err => {
      //   console.log("channel creation err", err)
      // })

      // this.fcm.subscribeToTopic('hour4u');

      // this.fcm.getToken().then(async token => {
      //   console.log("token-----", token)
      //   localStorage.setItem('FCMToken', token)
      //   await this.updateToken(token);
      // }).catch(err => {
      //   console.log("token err", err)
      // })

      // this.fcm.getInitialPushPayload().then(
      //   (data) => {
      //     console.log("data--4545-------", data)
      //   }
      // );

      // this.fcm.onTokenRefresh().subscribe(token => {
      //   console.log("refresh token---", token)
      //   localStorage.setItem('FCMToken', token)
      // });

      // this.fcm.onNotification().subscribe(async (payload: INotificationPayload) => {
      //   console.log("payload------", payload)
      //   this.pushPayload = payload;
      //   await this.performActionOnGetNotification();
      // }, (err) => {
      //   console.log("err in notification subscribe", err)
      // });

      /** FCM End */
    })

    // this.fcm.onNotification().subscribe(async (payload: INotificationPayload) =>
    // console.log("payload------", payload),
    // error => {
    //   console.log("error--", error)
    // }
    // );
  }

  // Update login user Device/FCM token
  async updateToken(token) {
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    if (loginUserMobileNo != null) {
      let obj = {
        deviceToken: token,
        mobile: loginUserMobileNo
      }
      await this.commonProvider.PutMethod(Apiurl.UpdateToken, obj).then(async (res: any) => {
      }).catch(err => {
        console.log(err)
      })
    }
  }

  // Redirect on particular page click on notification
  async performActionOnGetNotification() {
    setTimeout(() => {

      // if (this.pushPayload) {
      //   if (this.pushPayload.title == 'Profile Approved') {
      //     this.router.navigateByUrl('set-hourly-rates');
      //   }
      //   if (this.pushPayload.title == 'Job Application Actioned') {
      //     this.router.navigateByUrl('tabs/my-jobs');
      //   }
      //   if (this.pushPayload.title == 'Job Reminder') {
      //     this.router.navigateByUrl('tabs/detactive');
      //   }
      //   if (this.pushPayload.title == 'We found you a new job') {
      //     this.availableJobsService.selectedJobId = this.pushPayload.jobId;
      //     this.router.navigateByUrl('available-job-details');
      //   }
      // }
    }, 2000);
  }


  // private async setupFCM() {
  //   console.log('Subscribing to new notifications');
  //   this.fcm.onNotification().subscribe((payload) => {
  //     console.log("payload", payload)
  //     if (payload.wasTapped) {
  //       console.log("Received in background -> ", JSON.stringify(payload));
  //     } else {
  //       console.log("Received in foreground -> ", JSON.stringify(payload));
  //     }
  //     this.pushPayload = payload;
  //     console.log('onNotification received event with: ', payload);
  //   });

  // }
}

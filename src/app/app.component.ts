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
import { LocalNotifications } from '@capacitor/local-notifications';

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
        await PushNotifications.createChannel({
          id: "testchannel1",
          name: "testchannel1",
          description: "Very urgent message alert",
          sound: "default",
          importance: 4,
          visibility: 1,
          lights: true,
          lightColor: "yellow",
          vibration: true,
        }
        ).then(channel => {
          console.log('channel created', channel);
        }).catch(err => {
          console.log('channel created error', err)
        })

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
          async (notification: PushNotificationSchema) => {
            console.log('Push received: ', notification);
            PushNotifications.removeAllDeliveredNotifications(); // Remove globally getting notification when app open

            // Send Local push notification from global notification whn app open
            const notifs = await LocalNotifications.schedule({
              notifications: [
                {
                  title: notification?.title,
                  body: notification?.body,
                  id: 1,
                  schedule: { at: new Date(Date.now() + 1000 * 5) },
                  smallIcon: 'icon.png',
                  sound: null,
                  attachments: null,
                  actionTypeId: '',
                  extra: null,
                },
              ],
            });
            console.log('scheduled notifications', notifs);
          }
        );

        // Method called when tapping on a notification( App in background or killed mode)
        await PushNotifications.addListener('pushNotificationActionPerformed',
          async (notification: ActionPerformed) => {
            console.log('Push action performed---', notification);
            await this.performRedirectionOnNotification(notification?.notification);
          }
        );


        // local push notification when app Open 
        await LocalNotifications.addListener('localNotificationReceived', (data: any) => {
          console.log("localNotificationReceived=====", data)
        })

        // local push notification redirection when app Open 
        await LocalNotifications.addListener('localNotificationActionPerformed', async (data: any) => {
          console.log("localNotificationActionPerformed----", data)
          await this.performRedirectionOnLocalNotification(data);
        })

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
      if (notification && notification?.data) {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", notification?.data);
        if (notification?.data?.title == 'Profile Approved') {
          this.router.navigateByUrl('set-hourly-rate');
        }
        if (notification?.data?.title == 'Job Application Actioned') {
          this.router.navigateByUrl('tabs/my-jobs');
        }
        if (notification?.data?.title == 'Job Reminder') {
          this.router.navigateByUrl('tabs/active-job');
        }
        if (notification?.data?.title == 'We found you a new job') {
          this.router.navigateByUrl("available-job-details/" + notification?.data?.jobId)
        }
      }
    }, 2500);
  }

  // Localnotification action performed

  async performRedirectionOnLocalNotification(notification) {
    console.log("performRedirectionOnLocalNotification===========", notification)
    setTimeout(() => {
      this.loadingService.dismiss();
      if (notification && notification?.notification) {
        console.log("22222222222222222222222222222", notification?.notification);
        if (notification?.notification?.title == 'Profile Approved') {
          this.router.navigateByUrl('set-hourly-rate');
        }
        if (notification?.notification?.title == 'Job Application Actioned') {
          this.router.navigateByUrl('tabs/my-jobs');
        }
        if (notification?.notification?.title == 'Job Reminder') {
          this.router.navigateByUrl('tabs/active-job');
        }
        if (notification?.notification?.title == 'We found you a new job') {
          this.router.navigateByUrl("available-job-details/" + notification?.notification?.jobId)
        }
      }
    }, 1000);
  }
}

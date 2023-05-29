import { Component, NgZone, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AlertController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { NetworkService } from './core/services/network.service';
import { CommonProvider } from './core/common';
import { Apiurl } from './core/route';
import { AvailableJobsService } from './available-jobs/available-jobs.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { LocationService } from './core/services/location.service';
import { Storage } from '@ionic/storage';
import { Capacitor } from '@capacitor/core';
import { AppUpdateService } from './core/services/app-update.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LoadingService } from './core/services/loading.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { environment } from 'src/environments/environment';
import { OnboardingService } from './onboarding/onboarding.service';

declare var UXCam: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

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
    public loadingService: LoadingService,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
  }

  async initializeApp() {
    // Deep linking
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(async () => {
        let slug = null;
        if (environment.apiUrl == 'https://uatapi.hour4u.com/api/') { // UAT 
          slug = event.url.split("uatapp.hour4u.com/#/").pop();
        } else {
          slug = event.url.split("app.hour4u.com/#/").pop();
        }

        if (slug) {
          // this.loadingService.show();
          setTimeout(async () => {
            // this.loadingService.dismiss();
            this.appUpdateService.forDeepLink = true;
            const loginUserId = await this.storage.get('loginUserId');
            if (loginUserId) {
              let url = null;
              if (environment.apiUrl == 'https://uatapi.hour4u.com/api/') { // UAT 
                url = event.url.split("uatapp.hour4u.com/#/").pop();
              } else {
                url = event.url.split("app.hour4u.com/#/").pop();
              }
              slug = slug.replace('available-job-details-global/', 'available-job-details/');
              this.router.navigateByUrl(slug);
            } else {
              this.router.navigateByUrl(slug);
            }
          }, 2500)
        }
      });
    });

    this.platform.ready().then(async () => {
      if (Capacitor.getPlatform() !== 'web') {
        // Splash screen duration
        await SplashScreen.show({
          showDuration: 1800,
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
        if (Capacitor.getPlatform() == 'android') {
          window.screen.orientation.lock('portrait');
        }

        //UX-CAM Setup
        UXCam.optIntoSchematicRecordings();//To enable session video recording on iOS 
        const configuration = {
          userAppKey: Apiurl.UxCamAppKey,
          enableAutomaticScreenNameTagging: true,
          enableImprovedScreenCapture: true,
        }
        UXCam.startWithConfiguration(configuration);

        // App Update Check
        this.appUpdateService.checkAppUpdate();

        // Check current internet connection Status
        this.networkService.getInternetConnectionStatus();

        // Network connection change
        this.networkService.initializeNetworkEvents();

        // Device Back button logic
        this.platform.backButton.subscribeWithPriority(9999, () => {
          document.addEventListener('backbutton', function (event) {
            event.preventDefault();
            event.stopPropagation();
          }, false);
        });

        App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            this.modalCtrl.getTop().then((res: any) => {
              if (res) {
                this.modalCtrl.dismiss();
              } else {
                if (this.router.url.includes('tabs/available-jobs') || this.router.url.includes('launch-screen') ||
                  this.router.url.includes('onboarding/onboarding-phone-number') || this.router.url.includes('onboarding/onboarding-personal-info')) {
                  let alert = this.alertCtrl.create({
                    header: 'Exit',
                    cssClass: 'exit-alert',
                    id: 'exit-alert',
                    message: 'Are you sure you want to exit app?',
                    buttons: [
                      {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'cancel-btn',
                        handler: () => {
                          console.log('Cancel clicked');
                        }
                      },
                      {
                        text: 'Exit App',
                        cssClass: 'exit-btn',
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
          } else {
            let alert = this.alertCtrl.create({
              header: 'Exit',
              message: 'Are you sure you want to exit app?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'cancel-btn',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Exit App',
                  cssClass: 'exit-btn',
                  handler: () => {
                    App.exitApp();
                  }
                }
              ]
            });
            alert.then(res => {
              res.present();
            });
          }
        });

        // SMS send
        // const writeToClipboard = async () => {
        //   await Clipboard.write({
        //     string: "Hello World!"
        //   });
        // };
        // const checkClipboard = async () => {
        // const { type, value } = await Clipboard.read();

        // console.log(`Got ${type} from clipboard: ${value}`);
        // };

        // PUSH NOTIFICATION START
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
          await this.storage.set('FCMToken', token.value);
          localStorage.setItem('FCMToken', token.value);
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
                  extra: notification?.data,
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
        // PUSH NOTIFICATION END
      }
    })
  }

  // Update device token for notification
  async updateToken(token) {
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    if (token) {
      if (loginUserMobileNo) {
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
  }

  // Redirect on particular page click on notification start
  // Perform action on notification - When app running in BACKGROUND or KILL MODE
  async performRedirectionOnNotification(notification) {
    console.log("notification---------", notification)
    this.modalCtrl.getTop().then((res: any) => {
      if (res) {
        this.modalCtrl.dismiss();
      }
    })
    setTimeout(async () => {
      const loginUserId = await this.storage.get('loginUserId');
      this.loadingService.dismiss();
      if (notification && notification?.data) {
        if (notification?.data?.title == 'Profile Approved') {
          this.router.navigateByUrl('set-hourly-rates');
        }
        if (notification?.data?.title == 'Job Application Actioned') {
          this.router.navigateByUrl('tabs/my-jobs');
        }
        if (notification?.data?.title == 'Job Reminder') {
          this.router.navigateByUrl('tabs/active-job');
        }
        if (notification?.data?.title == 'We found you a new job') {
          if (loginUserId) {
            this.router.navigateByUrl("available-job-details/" + notification?.data?.jobId);
          } else {
            this.router.navigateByUrl("available-job-details-global/" + notification?.data?.jobId);
          }
        }
      }
    }, 2300);
  }

  // Localnotification action performed - When app is OPEN
  async performRedirectionOnLocalNotification(notification) {
    console.log("local notification---------", notification)
    this.modalCtrl.getTop().then((res: any) => {
      if (res) {
        this.modalCtrl.dismiss();
      }
    })
    setTimeout(async () => {
      const loginUserId = await this.storage.get('loginUserId');
      this.loadingService.dismiss();
      if (notification && notification?.notification) {
        if (notification?.notification?.title == 'Profile Approved') {
          this.router.navigateByUrl('set-hourly-rates');
        }
        if (notification?.notification?.title == 'Job Application Actioned') {
          this.router.navigateByUrl('tabs/my-jobs');
        }
        if (notification?.notification?.title == 'Job Reminder') {
          this.router.navigateByUrl('tabs/active-job');
        }
        if (notification?.notification?.title == 'We found you a new job') {
          if (loginUserId) {
            this.router.navigateByUrl("available-job-details/" + notification?.notification?.extra?.jobId);
          } else {
            this.router.navigateByUrl("available-job-details-global/" + notification?.notification?.extra?.jobId);
          }
        }
      }
    }, 1000);
  }
}

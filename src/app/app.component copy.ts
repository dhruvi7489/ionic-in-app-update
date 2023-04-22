import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { NetworkService } from './core/services/network.service';
// import { PushNotificationService } from './services/push-notifications.service';
// import { FCM } from '@capacitor-community/fcm';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { INotificationPayload } from 'cordova-plugin-fcm-with-dependecy-updated/typings/INotificationPayload';
import { CommonProvider } from './core/common';
import { Apiurl } from './core/route';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor(
    private platform: Platform,
    public networkService: NetworkService,
    public router: Router,
    public fcm: FCM,
    public splashScreen: SplashScreen,
    public commonProvider: CommonProvider,
    public storage: Storage
    // public pushNotificationService: PushNotificationService
  ) {
    this.initializeApp();
  }

  ngOnInit() { }

  async initializeApp() {

    this.platform.ready().then(() => {

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

      //  this.splashScreen.hide()

      // Notifications 
      // this.pushNotificationService.initPushNotification();

      // PushNotifications.requestPermissions().then(result => {
      //   console.log("result", result)
      //   if (result.receive === 'granted') {
      //     // Register with Apple / Google to receive push via APNS/FCM
      //     PushNotifications.register();
      //   } else {
      //     // Show some error
      //   }
      // });

      // // On success, we should be able to receive notifications
      // PushNotifications.addListener('registration',
      //   (token: Token) => {
      //     console.log("token", token)
      //   }
      // );

      // // Some issue with our setup and push will not work
      // PushNotifications.addListener('registrationError',
      //   (error: any) => {
      //     console.log("error", error)
      //   }
      // );

      // PushNotifications.createChannel({
      //   id: "testchannel1",
      //   name: "testchannel1",
      //   description: "Very urgent message alert",
      //   sound: "alert",
      //   importance: 5,
      //   visibility: -1,
      //   lights: true,
      //   lightColor: "#eee",
      //   vibration: true
      // }
      // ).then(channel => {
      //   console.log('channel created', channel);
      // }).catch(err => {
      //   console.log('channel created error', err)
      // })


      // // FCM
      // FCM.subscribeTo({ topic: "hour4u" }).then(res => {
      //   console.log("subscribeTo", res)
      // }).catch(err => {
      //   console.log(err);
      // })

      // FCM.getToken()
      //   .then((token) => {
      //     console.log("getToken", token);
      //   })
      //   .catch((err) => console.log(err););

      // FCM.setAutoInit({ enabled: true }).then((res) => {
      //   console.log("setAutoInit--", res)
      // });

      // FCM.isAutoInitEnabled().then((res) => {
      //   console.log("isAutoInitEnabled", res)
      //   console.log("Auto init is " + (res.enabled ? "enabled" : "disabled"));
      // });



      // Show us the notification payload if the app is open on our device
      // PushNotifications.addListener('pushNotificationReceived',
      //   (notification: PushNotificationSchema) => {
      //     console.log("notification---------", notification)
      //   }
      // );

      // // Method called when tapping on a notification
      // PushNotifications.addListener('pushNotificationActionPerformed',
      //   (notification: ActionPerformed) => {
      //     console.log("notification=====", notification)
      //   }
      // );

      /** FCM Start */
      this.fcm.createNotificationChannel({
        id: "testchannel1", // required
        name: "testchannel1", // required
        description: "Very urgent message alert",
        importance: "high", // https://developer.android.com/guide/topics/ui/notifiers/notifications#importance
        visibility: "public", // https://developer.android.com/training/notify-user/build-notification#lockscreenNotification
        sound: "alert_sound", // In the "alert_sound" example, the file should located as resources/raw/alert_sound.mp3
        lights: false, // enable lights for notifications
        vibration: true // enable vibration for notifications
      }).then(channel => {
        console.log('channel created', channel);
      });

      this.fcm.subscribeToTopic('hour4u');

      this.fcm.getToken().then(async token => {
        console.log("token-----", token)
        localStorage.setItem('FCMToken', token)
        await this.updateToken(token);
        // await this.storageService.setObject(FCM_TOKEN, token);
      });

      this.fcm.onNotification().subscribe(async (payload: INotificationPayload) => {
        console.log("payload------", payload)
        // this.pushPayload = payload;
        console.log('new notif ## ', payload);
        // this.jobRemiderService.employmentId = this.pushPayload.jobId;
        // if (this.pushPayload.wasTapped) {
        //     this.notification.receiveNew(this.notification.saveNotification(this.pushPayload));
        // } else {
        //     this.notification.receiveNew(this.notification.saveNotification(this.pushPayload));
        //     // for android only 
        //     if (this.platform.is('android')) {
        //         this.localNotifications.schedule({
        //             id: this.pushPayload.id,
        //             color: '#58c3b8',
        //             vibrate: true,
        //             title: this.pushPayload.title,
        //             text: this.pushPayload.body,

        //         });
        //     }

        // }
        // await this.performActionOnGetNotification();

        // if (this.pushPayload.jobId != null && this.pushPayload.jobId.length > 1) {
        //     console.log('open job view for #', this.pushPayload.jobId);
        // }
      });

      this.fcm.getInitialPushPayload().then(
        (data) => {
          console.log("data---------", data)
          // this.pushPayload = data;
          // await this.performActionOnGetNotification();
        }
      );

      this.fcm.onTokenRefresh().subscribe(token => {
        console.log("refresh token---", token)
        // this.storageService.setObject(FCM_TOKEN, token);
      });
      /** FCM End */

    })
  }

  async updateToken(token) {
    if (token) {
      const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
      if (loginUserMobileNo != null) {
        let obj = {
          deviceToken: token,
          mobile: loginUserMobileNo
        }
        await this.commonProvider.PutMethod(Apiurl.UpdateToken, obj).then(async (res: any) => {
          console.log(res)
          if (res) {
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
}

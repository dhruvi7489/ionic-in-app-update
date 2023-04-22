import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../common';
import { Apiurl } from '../route';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  notification: any;

  constructor(
    public commonProvider: CommonProvider,
    public storage: Storage,
    public router: Router,
    public loadingService: LoadingService
  ) {
    const notifyIn10seconds = new Date(Date.now() + 10000);
  }

  async initPushNotification() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (isPushNotificationsAvailable) {
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

      await PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
          console.log(" error ", result)
        }
      });

      // On success, we should be able to receive notifications
      await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
        this.storage.set('FCMToken', token.value);
        this.updateToken(token.value)
      });

      // Some issue with our setup and push will not work
      await PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      // Show us the notification payload if the app is open on our device
      await PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          this.notification = notification;
          console.log('Push received: ', notification);
        }
      );

      // Method called when tapping on a notification
      await PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          // setTimeout(() => {
          //   alert("pushNotificationActionPerformed");
          // }, 3000);
          // this.notification = notification?.notification;
          // this.performRedirectionOnNotification(notification);
        }
      );

    }
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

  // Perform action on notification
  async performRedirectionOnNotification(notification) {
    console.log("notification---------", notification)
    setTimeout(() => {
      if (notification && notification?.notification) {
        this.loadingService.dismiss();
        if (notification.notification.title == 'Profile Approved') {
          this.router.navigateByUrl('set-hourly-rate');
        }
        if (notification.notification.title == 'Job Application Actioned') {
          this.router.navigateByUrl('tabs/my-jobs');
        }
        if (notification.notification.title == 'Job Reminder') {
          this.router.navigateByUrl('tabs/active-job');
        }
        if (notification.notification.title == 'We found you a new job') {
          this.router.navigateByUrl("available-job-details/" + notification.notification?.body?.jobId)
        }
      }
    }, 1700);
  }
}


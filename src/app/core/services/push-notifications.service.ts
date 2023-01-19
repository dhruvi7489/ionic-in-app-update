import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
// import { FCM } from '@capacitor-community/fcm';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  notification: any;

  constructor(
  ) { }

  async initPushNotification() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    console.log(isPushNotificationsAvailable)
    if (isPushNotificationsAvailable) {
      await PushNotifications.createChannel({
        id: "testchannel1",
        name: "testchannel1",
        description: "Very urgent message alert",
        sound: "alert",
        importance: 5,
        visibility: 1,
        lights: true,
        lightColor: "#eee",
        vibration: true
      }
      ).then(channel => {
        console.log('channel created', channel);
      }).catch(err => {
        console.log('channel created error', err)
      })

      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      });

      await PushNotifications.getDeliveredNotifications().then(res => {
        console.log("getDeliveredNotifications----", res)
      }).catch(err => {
        console.log(err);
      })

      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          this.notification = notification;
          alert('Push received: ' + JSON.stringify(notification));
        }
      );

      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          alert('Push action performed: ' + JSON.stringify(notification));
        }
      );
    }

    // // FCM
    // FCM.subscribeTo({ topic: "hour4u" }).then(res => {
    //     alert('subscribed Topic')
    //     console.log("subscribeTo", res)
    // }).catch(err => {
    //     console.log(err);
    // })

    // FCM.getToken()
    //     .then((token) => {
    //         alert(`Token ${token.token}`);
    //         console.log("getToken", token);
    //     })
    //     .catch((err) => console.log(err););

    // FCM.setAutoInit({ enabled: true }).then((res) => {
    //     alert(`Auto init enabled`);
    //     console.log("setAutoInit--", res)
    // });

    // FCM.isAutoInitEnabled().then((res) => {
    //     console.log("isAutoInitEnabled", res)
    //     console.log("Auto init is " + (res.enabled ? "enabled" : "disabled"));
    // });


    //   PushNotifications.requestPermissions().then(result => {
    //     console.log("result", result)
    //     if (result.receive === 'granted') {
    //       // Register with Apple / Google to receive push via APNS/FCM
    //       PushNotifications.register();
    //     } else {
    //       // Show some error
    //     }
    //   });

    //   // On success, we should be able to receive notifications
    //   PushNotifications.addListener('registration',
    //     (token: Token) => {
    //       console.log("token", token)
    //       // alert('Push registration success, token: ' + token.value);
    //     }
    //   );

    //   // Some issue with our setup and push will not work
    //   PushNotifications.addListener('registrationError',
    //     (error: any) => {
    //       console.log("error", error)
    //       // alert('Error on registration: ' + JSON.stringify(error));
    //     }
    //   );

    //   // Show us the notification payload if the app is open on our device
    //   PushNotifications.addListener('pushNotificationReceived',
    //     (notification: PushNotificationSchema) => {
    //       console.log("notification---------", notification)
    //       // alert('Push received: ' + JSON.stringify(notification));
    //     }
    //   );

    //   // Method called when tapping on a notification
    //   PushNotifications.addListener('pushNotificationActionPerformed',
    //     (notification: ActionPerformed) => {
    //       console.log("notification=====", notification)
    //       // alert('Push action performed: ' + JSON.stringify(notification));
    //     }
    //   );
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { NetworkService } from './services/network.service';
// import { PushNotificationService } from './services/push-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor(
    private platform: Platform,
    public networkService: NetworkService,
    public router : Router
    // public pushNotificationService: PushNotificationService
  ) {
    this.initializeApp();
    console.log(this.router)
  }

  ngOnInit() { }

  async initializeApp() {

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
      await this.networkService.getInternetConnectionStatus();

      // Network connection change
      await this.networkService.initializeNetworkEvents();

      // Notifications 
      // this.pushNotificationService.initPushNotification();

      PushNotifications.requestPermissions().then(result => {
        console.log("result", result)
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });
  
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token: Token) => {
          console.log("token", token)
          alert('Push registration success, token: ' + token.value);
        }
      );
  
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
          console.log("error", error)
          alert('Error on registration: ' + JSON.stringify(error));
        }
      );
  
      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log("notification---------", notification)
          alert('Push received: ' + JSON.stringify(notification));
        }
      );
  
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          console.log("notification=====", notification)
          alert('Push action performed: ' + JSON.stringify(notification));
        }
      );

    })

  }
}

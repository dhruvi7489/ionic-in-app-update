import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { NetworkService } from './services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor(
    private platform: Platform,
    public networkService: NetworkService,
  ) {
    this.initializeApp();
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
    })

  }

}

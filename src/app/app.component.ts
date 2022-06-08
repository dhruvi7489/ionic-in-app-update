import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  ngOnInit() {
    StatusBar.setBackgroundColor({
      color: '#ffffff'
    });
    StatusBar.setStyle({
      style: Style.Light
    })

    window.screen.orientation.lock('portrait');
  }

}

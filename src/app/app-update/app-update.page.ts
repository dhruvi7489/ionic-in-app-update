import { Component, OnInit } from '@angular/core';
import { AppUpdateService } from 'src/app/core/services/app-update.service';

@Component({
  selector: 'app-app-update',
  templateUrl: './app-update.page.html',
  styleUrls: ['./app-update.page.scss'],
})
export class AppUpdatePage implements OnInit {

  constructor(
    public appUpdateService: AppUpdateService
  ) { }

  ngOnInit() {
  }

  async updateApp() {
    await this.appUpdateService.updateApp();
  }
}

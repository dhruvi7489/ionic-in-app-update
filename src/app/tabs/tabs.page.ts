import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  activeTab: string = '';

  constructor() { }

  setCurrentTab(event) {
    this.activeTab = event.tab;
  }
}

import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TOKEN_KEY } from '../core/storage-keys';
import { InternetConnectionPage } from '../internet-connection/internet-connection.page';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    constructor(
        public router: Router,
        public location: Location,
        public modalCtrl: ModalController,
        public storage: Storage
    ) { }

    public initializeNetworkEvents() {
        // Network change status detect
        Network.addListener('networkStatusChange', async (status: ConnectionStatus) => {
            if (!status.connected) {
                // this.router.navigateByUrl('internet-connection')
                this.modalCtrl.dismiss();
                const modal = await this.modalCtrl.create({
                    component: InternetConnectionPage,
                });
                await modal.present();
            }
            else {
                // this.location.back();
                this.modalCtrl.dismiss();
            }
        });
    }

    public async getInternetConnectionStatus() {
        const tokenKey = await this.storage.get(TOKEN_KEY);
        // Current network status get
        Network.getStatus().then(async (status: ConnectionStatus) => {
            if (!status.connected) {
                // this.router.navigateByUrl('internet-connection')
                this.modalCtrl.dismiss();
                const modal = await this.modalCtrl.create({
                    component: InternetConnectionPage,
                });
                await modal.present();
            } else {
                if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
                    if (tokenKey) {
                        this.modalCtrl.dismiss();
                        this.router.navigateByUrl("tabs/available-jobs/available-jobs-list");
                    } else {
                        this.modalCtrl.dismiss();
                    }
                }
            }
        }).catch((err: HttpErrorResponse) => {
            console.log(err);
        });
    }
}

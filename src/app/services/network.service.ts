import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionStatus, Network } from '@capacitor/network';
import { TOKEN_KEY } from '../core/storage-keys';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    constructor(
        public router: Router,
        public location: Location
    ) { }

    public initializeNetworkEvents() {
        // Network change status detect
        Network.addListener('networkStatusChange', status => {
            if (!status.connected) {
                this.router.navigateByUrl('internet-connection')
            } else {
                this.location.back();
            }
        });
    }

    public getInternetConnectionStatus() {
        // Current network status get
        Network.getStatus().then((status: ConnectionStatus) => {
            if (!status.connected) {
                this.router.navigateByUrl('internet-connection')
            } else {
                
                // if (localStorage.getItem(TOKEN_KEY)) {
                //     this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
                // }
                // this.location.back();
            }
        })
    }
}

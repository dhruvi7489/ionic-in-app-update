import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionStatus, Network } from '@capacitor/network';

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
            console.log(this.router)
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
                // this.location.back();
            }
        })
    }
}

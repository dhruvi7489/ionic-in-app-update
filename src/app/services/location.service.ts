import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Subject } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    locationPermissionGranted: boolean = false;
    currentLocationFetch: boolean = false;
    locationCordinates: any = null;
    public cordinates = new Subject<any>();

    constructor(
        public router: Router,
        public location: Location,
        public toastService: ToastService
    ) {
        Geolocation.checkPermissions().then(async (res) => {
            if (res.location == "denied") {
                await this.requestLocationPermission();
            }
            if (res.location == "granted") {
                this.locationPermissionGranted = true;
            }
        }).catch(err => {
            this.toastService.showMessage(err)
        })
    }

    async requestLocationPermission() {
        Geolocation.requestPermissions().then(async (res) => {
            if (res.location == 'granted') {
                this.locationPermissionGranted = true;
                this.getCurrentLocationPosition();
                setInterval(async () => {
                    this.getCurrentLocationPosition();
                }, 5000)
            }
        }).catch(err => {
            this.toastService.showMessage(err)
        })
    }

    async getCurrentLocationPosition() {
        Geolocation.getCurrentPosition().then(res => {
            this.locationCordinates = res;
            this.setLocationCordinates(res);
        }).catch(err => {
            this.setLocationCordinates(null);
            this.toastService.showMessage(err)
        })
    }

    setLocationCordinates(data: any) {
        this.cordinates.next(data);
    }

    getLocationCordinates(): Subject<any> {
        return this.cordinates;
    }
}

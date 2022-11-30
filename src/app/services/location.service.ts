import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
                this.locationPermissionGranted = false;
                await this.requestLocationPermission();
            }
            if (res.location == "granted") {
                this.locationPermissionGranted = true;
            }
        }).catch((err: HttpErrorResponse) => {
            this.toastService.showMessage(err.message)
        })
    }

    async requestLocationPermission(showErrorMsg = true) {
        Geolocation.requestPermissions().then(async (res) => {
            if (res.location == 'granted') {
                this.locationPermissionGranted = true;
                this.getCurrentLocationPosition(showErrorMsg);
                setInterval(async () => {
                    this.getCurrentLocationPosition(showErrorMsg);
                }, 5000)
            } else {
                this.locationPermissionGranted = false;
            }
        }).catch((err: HttpErrorResponse) => {
            this.toastService.showMessage(err.message)
        })
    }

    async getCurrentLocationPosition(showErrorMsg) {
        this.locationCordinates = null;
        Geolocation.getCurrentPosition().then((res: any) => {
            console.log(res)
            this.locationCordinates = res;
            this.setLocationCordinates(res);
        }).catch((err: HttpErrorResponse) => {
            this.setLocationCordinates(null);
            if (showErrorMsg) {
                this.toastService.showMessage(err.message)
            }
        })
    }

    setLocationCordinates(data: any) {
        this.cordinates.next(data);
    }

    getLocationCordinates(): Subject<any> {
        return this.cordinates;
    }
}

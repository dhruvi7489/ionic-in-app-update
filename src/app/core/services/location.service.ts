import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
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
    watchId: any = null;
    watchCoordinate: any;

    constructor(
        public router: Router,
        public location: Location,
        public toastService: ToastService,
        private zone: NgZone
    ) {
        Geolocation.checkPermissions().then(async (res) => {
            if (res.location === 'denied') {
                this.locationPermissionGranted = false;
                await this.requestLocationPermission();
            }
            if (res.location === 'granted') {
                this.locationPermissionGranted = true;
                this.getCurrentLocationPosition();
            }
        }).catch((err: HttpErrorResponse) => {
            this.toastService.showMessage(err.message);
        });
    }

    async requestLocationPermission(showErrorMsg = true) {
        Geolocation.requestPermissions().then(async (res) => {
            if
                (res.location === 'granted') {
                this.locationPermissionGranted = true;
                this.getCurrentLocationPosition(showErrorMsg);
                setInterval(async () => {
                    this.getCurrentLocationPosition(showErrorMsg);
                }, 5000);
            } else {
                this.locationPermissionGranted = false;
            }
        }).catch((err: HttpErrorResponse) => {
            if (err.message !== 'Not implemented on web.') {
                this.toastService.showMessage(err.message);
            }
        });
    }

    async getCurrentLocationPosition(showErrorMsg?) {
        this.locationCordinates = null;
        Geolocation.getCurrentPosition().then((res: any) => {
            this.locationCordinates = res;
            this.watchPosition();
            this.setLocationCordinates(res);
        }).catch((err: HttpErrorResponse) => {
            this.setLocationCordinates(null);
            if (showErrorMsg) {
                this.toastService.showMessage(err.message);
            }
        });
    }

    setLocationCordinates(data: any) {
        this.cordinates.next(data);
    }

    getLocationCordinates(): Subject<any> {
        return this.cordinates;
    }

    watchPosition() {
        try {
            this.watchId = Geolocation.watchPosition({}, (position, err) => {
                if (position) {
                    this.zone.run(() => {
                        this.watchCoordinate = {
                            latitude: position?.coords?.latitude,
                            longitude: position?.coords?.longitude,
                        };
                    });
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    clearWatch() {
        if (this.watchId != null) {
            Geolocation.clearWatch({ id: this.watchId });
        }
    }
}

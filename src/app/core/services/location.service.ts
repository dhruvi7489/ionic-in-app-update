import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Subject } from 'rxjs';
import { ToastService } from './toast.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Capacitor } from '@capacitor/core';

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
        private zone: NgZone,
        private locationAccuracy: LocationAccuracy
    ) {
        Geolocation.checkPermissions().then(async (res) => {
            if (res.location === 'denied') {
                this.locationPermissionGranted = false;
                await this.requestLocationPermission();
            }
            if (res.location === 'granted' || res.location.includes('prompt')) {
                this.locationPermissionGranted = true;
                // this.getCurrentLocationPosition();
                this.askGPSPermission(false);
            }
        }).catch((err: HttpErrorResponse) => {
            this.toastService.showMessage(err.message);
        });
    }

    // Request for location permission if user denied or prompt
    async requestLocationPermission(showErrorMsg = true) {
        if (Capacitor.getPlatform() !== 'web') {
            Geolocation.requestPermissions().then(async (res) => {
                console.log("+++++++++++++++++++++++++++++++++++++", res)
                if
                    (res.location === 'granted') {
                    this.locationPermissionGranted = true;
                    // this.getCurrentLocationPosition(showErrorMsg);
                    this.askGPSPermission(showErrorMsg);
                    // setInterval(async () => {
                    //     this.getCurrentLocationPosition(showErrorMsg);
                    // }, 5000);
                } else {
                    // if (res.location.includes('prompt')) {
                    //     await this.requestLocationPermission();
                    // } else {
                    this.askGPSPermission(showErrorMsg);
                    this.locationPermissionGranted = false;
                    // }
                }
            }).catch((err: HttpErrorResponse) => {
                console.log("~!!!!!!!!!!!!!!!!!!!", err)
                if (err.message !== 'Not implemented on web.') {
                    this.toastService.showMessage(err.message);
                }
            });
        } else {
            await this.fetchLocationFromWebPermisssion();
        }
    }

    // Get location cocordinates in app
    async getCurrentLocationPosition(showErrorMsg?) {
        this.locationCordinates = null;
        Geolocation.getCurrentPosition().then((res: any) => {
            console.log("location get=", res)
            this.locationCordinates = res;
            this.watchPosition();
            this.setLocationCordinates(res);
        }).catch((err: HttpErrorResponse) => {
            this.setLocationCordinates(null);
            console.log("location fetch err=", err)
            if (showErrorMsg) {
                if (err.message.includes('disabled')) {
                    this.toastService.showMessage("Please enable your device location");
                } else {
                    this.toastService.showMessage(err.message);
                    // this.requestLocationPermission();
                }
            }
        });
    }

    // Ask Physical mobile location enable 
    askGPSPermission(showErrorMsg) {
        console.log("askGPSPermission calll ")
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            console.log("canRequest", canRequest)
            // if (canRequest) {
            // } else {
            this.requestToSwitchOnGPS(showErrorMsg);
            // }
        }).catch(err => {
            if (!err.includes('cordova_not_available')) {
                this.toastService.showMessage(err.message);
            }
        })
    }

    // On Physical location
    requestToSwitchOnGPS(showErrorMsg) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
                this.getCurrentLocationPosition(showErrorMsg);
            },
            error => {
                this.toastService.showMessage(error.message);
            }
        ).catch(err => {
            console.log("))))))))))))", err)
        })
        console.log(this.locationCordinates)
    }


    // Fetch location in Web browser
    fetchLocationFromWebPermisssion() {
        let self = this;
        navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
            if (result.state == 'granted') {
                self.getLocation();
            } else if (result.state == 'prompt') {
                self.getLocation();
            } else if (result.state == 'denied') {
                self.getLocation();
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // Get location in Web browser
    getLocation() {
        if ('geolocation' in navigator) {
            if (this.locationCordinates) {
            } else {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.locationCordinates = position;
                    this.setLocationCordinates(position);
                }, (err) => {
                    console.log("err", err)
                    this.toastService.showMessage(err.message);
                });
            }
        } else {
        }
    }

    // Set location Coordinates
    setLocationCordinates(data: any) {
        this.locationCordinates = data;
        this.cordinates.next(data);
    }

    // Get location Coordinates
    getLocationCordinates(): Subject<any> {
        return this.cordinates;
    }

    // Watch set on mobile app location 
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
            console.log("________", e);
        }
    }

    // Watch Clear on mobile app location 
    clearWatch() {
        if (this.watchId != null) {
            Geolocation.clearWatch({ id: this.watchId });
        }
    }
}

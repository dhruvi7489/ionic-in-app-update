import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor(
        public router: Router,
        public location: Location
    ) {
        Geolocation.checkPermissions().then(res => {
            // console.log("++++", res)
            if (res.location == "denied") {
                Geolocation.requestPermissions().then(res => {
                    // console.log(res, ")))))))))")
                })
            }
        })
        // Geolocation.getCurrentPosition().then(res => {
        //     console.log("---", res)
        // })
    }


}

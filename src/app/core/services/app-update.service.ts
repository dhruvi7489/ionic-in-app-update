import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { AppUpdate } from '@ionic-native/app-update/ngx';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';

@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {
    // updateUrl = 'https://uat.hour4u.com/appVersion/version.xml';
    forDeepLink: boolean = false;
    showListPage: boolean = false;

    constructor(
        public router: Router
        // public appUpdate: AppUpdate,
    ) {
        // this.checkAppUpdate();
    }

    async checkAppUpdate() {
        //     this.appUpdate.checkAppUpdate(this.updateUrl).then((update: any) => {
        //         console.log('update------', update);
        //     }).catch((error: any) => {
        //         console.log('error----------', error);
        //     });


        // const getCurrentAppVersion = async () => {
        // const result = await AppUpdate.getAppUpdateInfo();
        // console.log("AppUpdate=========", result)

        AppUpdate.getAppUpdateInfo().then((res: any) => {
            console.log("AppUpdate----", res)
            if (res.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
                return;
            }
            if (res.immediateUpdateAllowed) {
                this.router.navigateByUrl('app-update');
                // AppUpdate.openAppStore({ country: 'IN' });
                // AppUpdate.startFlexibleUpdate().then(res => {
                //     console.log("++++++++res---", res)
                //     AppUpdate.completeFlexibleUpdate().then(data => {
                //         console.log("calllllll------", data)
                //     }).catch(err => {
                //         console.log("callerr---", err)
                //     });
                // }).catch(err => {
                //     console.log("err--=---", err)
                // })
            }
            // if (res.immediateUpdateAllowed) {
            //     AppUpdate.performImmediateUpdate().then(res => {
            //         console.log("++++++++res", res)
            //     }).catch(err => {
            //         console.log("err--", err)
            //     })
            // }
        }).catch(err => {
            console.log("AppUpdate Err===", err)
        })
    }


    updateApp() {
        AppUpdate.performImmediateUpdate().then(res => {
            console.log("performImmediateUpdate---", res)
            if (res.code == 5) {
                this.checkAppUpdate();
            }
        }).catch(err => {
            console.log("performImmediateUpdate err---", err)
        });
    }
}

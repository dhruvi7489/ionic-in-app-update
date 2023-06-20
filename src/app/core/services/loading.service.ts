import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    loading: any = null;
    constructor(public loadingCtrl: LoadingController) { }

    async show(message?: string) {
        this.loading = await this.loadingCtrl.create({
            message,
            cssClass: 'custom-loader',
        });
        await this.loading.present();
    }

    async dismiss() {
        if (this.loading) {
            await this.loadingCtrl.dismiss(this.loading);
        } else {
            await this.loadingCtrl.dismiss();
        }
    }

    // check loader available
    getTop() {
        this.loadingCtrl.getTop().then((res) => {
            if (res) {
                this.loadingCtrl.dismiss();
            }
        });
    }
}

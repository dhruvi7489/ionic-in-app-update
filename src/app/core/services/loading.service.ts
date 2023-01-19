import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    constructor(public loadingCtrl: LoadingController) { }

    async show(message?: string) {
        const loading = await this.loadingCtrl.create({
            message,
            cssClass: 'custom-loader',
        });
        loading.present();
    }

    dismiss() {
        this.loadingCtrl.dismiss();
    }
}

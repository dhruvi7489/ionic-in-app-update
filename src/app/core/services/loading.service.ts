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
        this.loading.present();
    }

    dismiss() {
        this.loadingCtrl.dismiss();
    }
}

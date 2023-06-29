import { Injectable } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ActionAlertService {
    loading: any = null;
    constructor(public actionSheetController: ActionSheetController,
        public modalCtrl: ModalController) { }

    // check Action Sheet available
    getTopActionSheet() {
        this.actionSheetController.getTop().then((res) => {
            if (res) {
                this.actionSheetController.dismiss();
            }
        });
    }

    // check Modal available
    getTopModalCtrl() {
        this.modalCtrl.getTop().then((res) => {
            if (res) {
                this.modalCtrl.dismiss();
            }
        });
    }
}

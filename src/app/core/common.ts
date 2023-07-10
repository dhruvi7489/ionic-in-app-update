import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastService } from './services/toast.service';
import { ApiService } from './services/api.service';
import { Apiurl } from './route';
import { TOKEN_KEY, TOKEN_TYPE } from './storage-keys';
import { map } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class CommonProvider {
    ImagePath = Apiurl.ImagePath;
    public refreshPage = new Subject<any>();

    constructor(
        public http: HttpClient,
        private toastService: ToastService,
        public apiService: ApiService,
        public loadingService: LoadingService,
        public storage: Storage
    ) {
    }

    // GET METHOD
    async GetMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        const TokenKey = await this.storage.get(TOKEN_KEY);
        const TokenType = await this.storage.get(TOKEN_TYPE);
        // this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: TokenType + " " + TokenKey
        });
        // setTimeout(() => {
        //     this.loadingService.dismiss();
        // }, 3000);
        return new Promise(async (resolve, reject) => {
            return this.http
                .get(Apiurl.RoutePath + url, { params: data, headers: httpHeader, observe: 'response' })
                .subscribe(
                    (data: any) => {
                        if (data.status == 200 || data.status == 201 || data.status == 202 || data.status == 204) {
                            resolve(data.body);
                        }
                        // this.loadingService.dismiss();
                    },
                    (error: HttpErrorResponse) => {
                        reject(error)
                        // this.loadingService.dismiss();
                        if (error && error.error && error.error.message) {
                            this.toastService.showMessage(error.error.message)
                        }
                    }
                );
        });
    }

    // POST METHOD
    async PostMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        const TokenKey = await this.storage.get(TOKEN_KEY);
        const TokenType = await this.storage.get(TOKEN_TYPE);
        // this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: TokenType + " " + TokenKey
        });

        return new Promise(async (resolve, reject) => {
            return this.http
                .post(Apiurl.RoutePath + url, data, { headers: httpHeader, observe: 'response' })
                .subscribe(
                    (data: any) => {
                        if (data.status == 200 || data.status == 201 || data.status == 202 || data.status == 204) {
                            resolve(data.body);
                        }
                        // this.loadingService.dismiss();
                    },
                    (error: HttpErrorResponse) => {
                        reject(error)
                        // this.loadingService.dismiss();
                        if (error && error.error && error.error.message) {
                            this.toastService.showMessage(error.error.message)
                        }
                    }
                );
        });
    }

    // PUT METHOD
    async PutMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        const TokenKey = await this.storage.get(TOKEN_KEY);
        const TokenType = await this.storage.get(TOKEN_TYPE);
        // this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: TokenType + " " + TokenKey
        });

        return new Promise(async (resolve, reject) => {
            return this.http.put(Apiurl.RoutePath + url, data, { headers: httpHeader, observe: 'response' }).subscribe(
                (data: any) => {
                    if (data.status == 200 || data.status == 201 || data.status == 202 || data.status == 204) {
                        resolve(data.body);
                    }
                    // this.loadingService.dismiss();
                },
                (error: any) => {
                    reject(error)
                    // this.loadingService.dismiss();
                    if (error && error.error && error.error.message) {
                        this.toastService.showMessage(error.error.message)
                    }
                }
            );
        });
    }


    // Delete METHOD
    async DeleteMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        const TokenKey = await this.storage.get(TOKEN_KEY);
        const TokenType = await this.storage.get(TOKEN_TYPE);
        // this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: TokenType + " " + TokenKey
        });
        return new Promise(async (resolve, reject) => {
            return this.http.delete(Apiurl.RoutePath + url, { headers: httpHeader, observe: 'response' }).subscribe(
                (data: any) => {
                    if (data.status == 200 || data.status == 201 || data.status == 202 || data.status == 204) {
                        resolve(data.body);
                    }
                    // this.loadingService.dismiss();
                },
                (error: any) => {
                    reject(error)
                    // this.loadingService.dismiss();
                    if (error && error.error && error.error.message) {
                        this.toastService.showMessage(error.error.message)
                    }
                }
            );
        });
    }



    //Custom POST METHOD
    async PostMethodCustom(
        url: any,
        data: any,
        headers?: any
    ) {
        // this.loadingService.show();
        const httpHeader = new HttpHeaders({
            //     Authorization: TokenType + " " + TokenKey
            // });
            // headers: {
            "origin": "http://localhost:8100",
            // "Content-Type": "application/html",
            'Access-Control-Allow-Origin': '*',
            // "responseType": 'application/html'
        });

        return new Promise(async (resolve, reject) => {
            return this.http
                .post(url, data, { headers: httpHeader, observe: 'response' })
                .subscribe(
                    (data: any) => {
                        if (data.status == 200 || data.status == 201 || data.status == 202 || data.status == 204) {
                            resolve(data.body);
                        }
                        // this.loadingService.dismiss();
                    },
                    (error: HttpErrorResponse) => {
                        reject(error)
                        // this.loadingService.dismiss();
                        if (error && error.error && error.error.message) {
                            this.toastService.showMessage(error.error.message)
                        }
                    }
                );
        });
    }


    //Custom GET METHOD
    async GetMethodCustom(
        url: any,
        data: any,
        headers?: any
    ) {
        const TokenKey = await this.storage.get(TOKEN_KEY);
        const TokenType = await this.storage.get(TOKEN_TYPE);
        // this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: TokenType + " " + TokenKey
        });

        return new Promise(async (resolve, reject) => {
            return this.http
                .get(url, { params: data, headers: httpHeader, observe: 'response' })
                .subscribe(
                    (data: any) => {
                        if (data.status == 200 || data.status == 201 || data.status == 202 || data.status == 204) {
                            resolve(data.body);
                        }
                        // this.loadingService.dismiss();
                    },
                    (error: HttpErrorResponse) => {
                        reject(error)
                        // this.loadingService.dismiss();
                        if (error && error.error && error.error.message) {
                            this.toastService.showMessage(error.error.message)
                        }
                    }
                );
        });
    }


    // Observable for page refresh
    // Set location Coordinates
    setRefreshMyEarningPage(data: any) {
        this.refreshPage.next(data);
    }

    // Get location Coordinates
    getRefreshMyEarningPage(): Subject<any> {
        return this.refreshPage;
    }
}

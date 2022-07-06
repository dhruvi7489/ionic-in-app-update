import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ApiService } from './api.service';
import { Apiurl } from './route';
import { TOKEN_KEY, TOKEN_TYPE } from './storage-keys';
import { map } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable({
    providedIn: 'root'
})
export class CommonProvider {
    ImagePath = Apiurl.ImagePath;

    constructor(
        public http: HttpClient,
        private toastService: ToastService,
        public apiService: ApiService,
        public loadingService: LoadingService
    ) {
    }

    // GET METHOD
    GetMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: localStorage.getItem(TOKEN_TYPE) + " " + localStorage.getItem(TOKEN_KEY)
        });
        return new Promise(async (resolve, reject) => {
            return this.http
                .get(Apiurl.RoutePath + url, { params: data, headers: httpHeader })
                .subscribe(
                    (data: any) => {
                        resolve(data);
                        this.loadingService.dismiss();
                    },
                    (error: HttpErrorResponse) => {
                        reject(error)
                        this.loadingService.dismiss();
                        if (error && error.error && error.error.message) {
                            this.toastService.showMessage(error.error.message)
                        }
                    }
                );
        });
    }

    // POST METHOD
    PostMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: localStorage.getItem(TOKEN_TYPE) + " " + localStorage.getItem(TOKEN_KEY)
        });

        return new Promise(async (resolve, reject) => {
            return this.http
                .post(Apiurl.RoutePath + url, data, { headers: httpHeader })
                .subscribe(
                    (data: any) => {
                        resolve(data);
                        this.loadingService.dismiss();
                    },
                    (error: HttpErrorResponse) => {
                        reject(error)
                        this.loadingService.dismiss();
                        if (error && error.error && error.error.message) {
                            this.toastService.showMessage(error.error.message)
                        }
                    }
                );
        });
    }

    // PUT METHOD
    PutMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        this.loadingService.show();
        const httpHeader = new HttpHeaders({
            Authorization: localStorage.getItem(TOKEN_TYPE) + " " + localStorage.getItem(TOKEN_KEY)
        });

        return new Promise(async (resolve, reject) => {
            return this.http.put(Apiurl.RoutePath + url, data, { headers: httpHeader }).subscribe(
                (data: any) => {
                    resolve(data);
                    this.loadingService.dismiss();
                },
                (error: any) => {
                    reject(error)
                    this.loadingService.dismiss();
                    if (error && error.error && error.error.message) {
                        this.toastService.showMessage(error.error.message)
                    }
                }
            );
        });
    }
}

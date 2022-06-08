import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ApiService } from './api.service';
import { Apiurl } from './route';
import { TOKEN_KEY } from './storage-keys';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommonProvider {
    ImagePath = Apiurl.ImagePath;

    constructor(
        public http: HttpClient,
        private toastService: ToastService,
        public apiService: ApiService
    ) {
    }

    // GET METHOD
    GetMethod(
        url: any,
        data: any,
        headers?: any
    ) {
        const httpHeader = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY)
        });
        return new Promise(async (resolve, reject) => {
            return this.http
                .get(Apiurl.RoutePath + url, { params: data, headers: httpHeader })
                .subscribe(
                    (data: any) => {
                        resolve(data);
                    },
                    (error: HttpErrorResponse) => {
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
        const httpHeader = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY)
        });

        return new Promise(async (resolve, reject) => {
            return this.http
                .post(Apiurl.RoutePath + url, data, { headers: httpHeader })
                .subscribe(
                    (data: any) => {
                        resolve(data);
                    },
                    (error: HttpErrorResponse) => {
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
        const httpHeader = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY)
        });


        return new Promise(async (resolve, reject) => {
            return this.http.put(Apiurl.RoutePath + url, data, { headers: httpHeader }).subscribe(
                (data: any) => {
                    resolve(data);
                },
                (error: any) => {
                    if (error && error.error && error.error.message) {
                        this.toastService.showMessage(error.error.message)
                    }
                }
            );
        });
    }
}

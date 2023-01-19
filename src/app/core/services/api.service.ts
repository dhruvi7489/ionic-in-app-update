import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apiurl } from '../route';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) { }
    public get<T>(url: string, options?: any): Observable<any> {
        return this.http.get<T>(Apiurl.RoutePath + url, options);
    }

    public post<T>(url: string, body: any, options?: any): Observable<any> {
        return this.http.post<T>(Apiurl.RoutePath + url, body, options);
    }

    public put<T>(url: string, body: any, options?: any): Observable<any> {
        return this.http.put<T>(Apiurl.RoutePath + url, body, options);
    }

    public delete<T>(url: string, options?: any): Observable<any> {
        return this.http.delete(Apiurl.RoutePath + url, options);
    }
}

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { observable, Observable } from "rxjs";
import { global } from "./global";


@Injectable()
export class UtilidadesService {
    public url: string;
    constructor(public _http: HttpClient) {
        this.url = global.url;
    }
    getAllConta04(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'utilidades/getAllConta04', params, { headers: headers });

    }
   



}



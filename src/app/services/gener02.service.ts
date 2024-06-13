import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Gener02 } from "../models/gener02";
import { global } from "./global";
import { Router } from "@angular/router";


@Injectable()
export class Gener02Service {
    public url: string;
    public identity: any;
    public token: any;
    constructor(public _http: HttpClient, private _route: Router,
    ) {
        this.url = global.url;
    }

    signup(user: any, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = 'true';
        }
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'login', params, { headers: headers });
    }

    getUsuario(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'user/getUsuario', params, { headers: headers });
    }

    getIdentity() {

        let identity = JSON.parse(localStorage.getItem('identity') + '');

        if (identity && identity != 'undefined') {
            this.identity = identity;
            this.identity = identity;

            const fechaActual = new Date();
            const fecha = new Date(identity.iat * 1000);

            var actual = Math.floor(fechaActual.getTime() / 1000);
            var anterior = Math.floor(fecha.getTime() / 1000);

            var diferencia = actual - anterior;
            if (diferencia > 57600) {
                this.eliminar()
                this.identity = null;
                this._route.navigate(['/login']);
            }
        } else {
            this.identity = null;
        }
        return this.identity;

    }
    getToken() {
        let token = localStorage.getItem('token');
        if (token && token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
    eliminar() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.removeItem('tpago');
        localStorage.removeItem('token1');
        localStorage.removeItem('tpa');
        localStorage.removeItem('identity2');
        localStorage.removeItem('identity1');
        localStorage.removeItem('permisos');
    }
}
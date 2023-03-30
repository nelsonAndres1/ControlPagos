import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Teso13 } from "../models/teso13";
import { global } from "./global";



@Injectable()
export class Teso13Service {
    public url: string;
    public identity: any;
    public token: any;
    constructor(public _http: HttpClient) {
        this.url = global.url;
    }
    test() {
        return "Service Run";
    }

    getConta28(pclave: any) {
        const response = new Promise(resolve => {
            this._http.get(global.url + `teso13/searchConta28?search=${pclave}`).subscribe(
                data => {
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
        return response;
    }

    getC71(pclave: any) {
        const response = new Promise(resolve => {
            this._http.get(global.url + `teso13/searchC71?search=${pclave}`).subscribe(
                data => {
                    resolve(data);

                }, err => {
                    console.log(err);

                });
        });
        return response;
    }



    getConta06(pclave: any) {
        const response = new Promise(resolve => {
            this._http.get(global.url + `teso13/search?search=${pclave}`).subscribe(
                data => {
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
        return response;
    }
    getConta04(pclave: any) {
        const response = new Promise(resolve => {
            this._http.get(global.url + `teso13/searchConta04?search=${pclave}`).subscribe(
                data => {
                    resolve(data);
                }, err => {
                    console.log(err);
                });
        });
        return response;
    }

    name_teso10(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso113/name_teso10', params, { headers: headers });
    }

    register(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        console.log("aqui!");
        console.log(params);
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13', params, { headers: headers });
    }
    traerConsecutivo(user: any, gettoken: any = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = 'true';
        }
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        //console.log(this._http.post(this.url+'teso13/consecutivo', params,{headers: headers}));
        return this._http.post(this.url + 'teso13/consecutivo', params, { headers: headers });
    }
    traerCodClas(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13/traerCod', params, { headers: headers });
    }

    downloadFile(user: any): Observable<any> {
        /* let json = JSON.stringify(user);
        let params = 'json=' + json; */
        /*         console.log(params); */
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + `teso13/downloadFile?json=${user}`, { headers: headers, responseType: 'blob' as 'json' });
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity') + '');

        if (identity && identity != 'undefined') {

            if (identity && identity != 'undefined') {
                this.identity = identity;
            } else {
                this.identity = null;
            }
            return this.identity;
        }
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

    getTeso17(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13/teso17', params, { headers: headers });
    }

    getbusqueda71(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13/busqueda71', params, { headers: headers });
    }
    valorCDP(user: any): Observable<any> {

        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13/valorCDP', params, { headers: headers });

    }
    fecha(): Observable<any> {

        let json = JSON.stringify('');//convierto los datos en un json string 
        let params = "json=" + json;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13/fecha', { headers: headers });
    }

    getSoportes(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = "json=" + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13/TraerSoportes', params, { headers: headers });
    }

    getAllTeso13Pri(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = "json=" + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'teso13/getAllTeso13Pri', params, { headers: headers });
    }






}
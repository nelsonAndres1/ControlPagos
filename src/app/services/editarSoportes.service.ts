import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { observable, Observable } from "rxjs";
import { global } from "./global";


@Injectable()
export class EditarSoportesService {
    public url: string;
    constructor(public _http: HttpClient) {
        this.url = global.url;
    }
    getInfoPago(user: any): Observable<any> {

        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'editar/getInfoPago', params, { headers: headers });

    }

    getInfoPagoeditar(user: any): Observable<any> {

        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'editar/getInfoPagoeditar', params, { headers: headers });

    }

    deleteSoporte(body: { codclas: string; numero: string | number; codsop: string | number; archivo?: string }): Observable<any> {
        // endpoint sugerido, ajústalo a tu backend
        return this._http.post(`${this.url}teso12/eliminarDocumento`, body);
        // Alternativa con DELETE y query params si tu backend lo soporta:
        // return this._http.delete(`${this.url}teso12/eliminarDocumento`, { params: { ... } });
    }

}



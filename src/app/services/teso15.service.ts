import { Injectable, Query } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Teso15 } from "../models/teso15";
import { global } from "./global";
import { Observable } from "rxjs";

@Injectable()

export class Teso15Service {
    data: Teso15[];
    public url: string;
    constructor(private http: HttpClient) {
        this.url = global.url;

    }
    read(query = '') {
        return this.http.get(this.url + 'teso15', { params: { buscar: query } });
    }
    getTPago(pclave: any) {
        const response = new Promise(resolve => {
            this.http.get(global.url + `teso15/search?search=${pclave}`).subscribe(
                data => {
                    resolve(data);

                }, err => {
                    console.log(err);

                });
        });
        return response;
    }
    getUsuario(user: any, gettoken = null): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'teso15/traerUsuario', params, { headers: headers });
    }

    getAllTeso13(user: any, gettoken = null): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'teso13/getAllTeso13', params, { headers: headers });
    }

    save(user: any, gettoken = null): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'teso15/save', params, { headers: headers });
    }



}
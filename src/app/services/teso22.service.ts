import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Teso22Service {
  public url: string;
  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  getDistinctTeso21(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/getDistinctTeso21', params, { headers: headers });
  }

  save(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/save', params, { headers: headers });
  }

  getTeso22All(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/getTeso22All', params, { headers: headers });
  }

  eliminar(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/eliminar', params, { headers: headers });
  }

  getTeso22First(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/getTeso22First', params, { headers: headers });
  }

  getEstadoPago(user: any, gettoken = null): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/getEstadoPago', params, { headers: headers });
  }

  getHistoriaPago(user: any, gettoken = null): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/getHistoriaPago', params, { headers: headers });
  }

  getPagosPendientes(user: any, gettoken = null): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso22/getPagosPendientes', params, { headers: headers });
  }


}



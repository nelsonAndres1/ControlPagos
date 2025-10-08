import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Teso16Service {
  public url: string;
  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  getUsuarios(pclave: any) {
    const response = new Promise(resolve => {
      this.http.get(global.url + `teso16/search?search=${pclave}`).subscribe(
        data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    return response;
  }

  registerTeso16(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso16/setTeso16', params, { headers: headers });
  }

  getTeso16(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso16/getTeso16', params, { headers: headers });
  }
  deleteTeso16(user: any): Observable<any> {
    const json = JSON.stringify(user);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'teso16/deleteTeso16', params, { headers });
  }

  deleteTeso16Bulk(user: any): Observable<any> {
    const json = JSON.stringify(user);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'teso16/deleteTeso16Bulk', params, { headers });
  }

  listarTeso16(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso16/listarTeso16', params, { headers: headers });
  }

  getReportePermisos(params?: { usuario?: string; estche?: string }): Observable<any> {
    let query = '';
    if (params) {
      const qs = new URLSearchParams();
      if (params.usuario) qs.set('usuario', params.usuario);
      if (params.estche) qs.set('estche', params.estche);
      query = '?' + qs.toString();
    }
    return this.http.get(this.url + 'teso16/report' + query);
  }

  descargarReporteCSV(params?: { usuario?: string; estche?: string }): Observable<Blob> {
    const qs = new URLSearchParams();
    if (params?.usuario) qs.set('usuario', params.usuario);
    if (params?.estche) qs.set('estche', params.estche);
    qs.set('format', 'csv');

    return this.http.get(this.url + 'teso16/report?' + qs.toString(), {
      responseType: 'blob'
    });
  }



}
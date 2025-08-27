import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Teso114Service } from './teso114.service';
import { Observable, catchError, of } from 'rxjs';

export interface UpdatePayload {
  codsop: number | string;
  detsop: string;
  decsop: string;
  estado: string; // 'ACTIVO' | 'INACTIVO' | otros valores permitidos por tu backend
}

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
}


@Injectable({
  providedIn: 'root'
})




export class Teso112Service {
  public url: string



  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  getTsoportes(pclave: any) {
    const response = new Promise(resolve => {
      this.http.get(global.url + `teso11/buscar?search=${pclave}`).subscribe(
        data => {
          resolve(data);
        }, err => {

        });
    });
    return response;
  }


  // teso112.service.ts
  inactivateMany(body: { ids: Array<number | string>; estado: 'INACTIVO' | 'ACTIVO' }) {
    const json = JSON.stringify(body);
    const params = 'json=' + encodeURIComponent(json);
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<ApiResponse>(this.url + 'teso11/inactivateManyTeso11', params, { headers })
      .pipe(catchError(err => of({ status: 'error', message: err?.error?.message || 'Error de red' } as ApiResponse)));
  }

  Exist(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'teso14/Exists', params, { headers: headers });

  }

  update(payload: UpdatePayload, gettoken: any = null): Observable<ApiResponse> {
    const user: any = { ...payload };
    if (gettoken != null) {
      user.gettoken = 'true';
    }

    const json = JSON.stringify(user);
    const params = 'json=' + encodeURIComponent(json);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post<ApiResponse>(this.url + 'teso14/updateTeso11', params, { headers })
      .pipe(
        catchError((err) => {
          return of({
            status: 'error',
            message: err?.error?.message || 'Error de red o del servidor'
          } as ApiResponse);
        })
      );
  }
  delete(user: any, gettoken: any = null): Observable<any> {
    if (gettoken != null) {
      user.gettoken = 'true';

    }
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'teso14/deleteTeso11', params, { headers: headers });
  }




}
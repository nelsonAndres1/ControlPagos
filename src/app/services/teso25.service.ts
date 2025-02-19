import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Teso25Service {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  private performRequest(endpoint: string, data: any): Observable<any> {
    const json = JSON.stringify(data);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(`${this.url}${endpoint}`, params, { headers: headers });
  }

  register(user: any): Observable<any> {
    return this.performRequest('teso25/register', user);
  }

  getNotificacion(user: any): Observable<any> {
    return this.performRequest('teso25/getNotificacion', user);
  }

  delete(user: any): Observable<any> {
    return this.performRequest('teso25/delete', user);
  }

  update(user: any): Observable<any> {
    return this.performRequest('teso25/update', user);
  }
}

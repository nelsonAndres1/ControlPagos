import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Teso18Service {
  public url: string;
  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  traerNSoportes(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso13/traerNSoportes', params, { headers: headers });
  }

  deleteSoportes(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso13/deleteSoportes', params, { headers: headers });
  }

  saveTeso18(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso18/saveTeso18', params, { headers: headers });
  }

  getTeso18(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso18/getTeso18', params, { headers: headers });
  }

  estadoTeso18(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso18/estadoTeso18', params, { headers: headers });
  }

  deleteTeso18(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'teso18/deleteTeso18', params, { headers: headers });
  }
  

  getUsers(pclave: any) {
    const response = new Promise(resolve => {
      this.http.get(global.url + `teso18/searchUsers?search=${pclave}`).subscribe(
        data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    return response;
  }

  searchNomin02(pclave: any) {
    const response = new Promise(resolve => {
      this.http.get(global.url + `teso18/searchNomin02?search=${pclave}`).subscribe(
        data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
    return response;
  }




}



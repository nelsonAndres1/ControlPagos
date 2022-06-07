import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Teso18Service {
  public url : string;
  constructor(private http: HttpClient) {
    this.url= global.url;
   }

   traerNSoportes(user:any): Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url+'teso13/traerNSoportes', params, {headers : headers}); 
  }

  deleteSoportes(user:any):Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url+'teso13/deleteSoportes', params, {headers:headers});
  }
}



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Teso114Service } from './teso114.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Teso14Service {
  public url:string;
  constructor(private http: HttpClient) {
    this.url=global.url; 
  }

  getTPago(pclave: any){
    const response = new Promise(resolve =>{
        this.http.get(global.url+`teso14/buscar?search=${pclave}`).subscribe(
          data => {
            resolve(data);
          }, err =>{
            console.log(err);
          });
    });
    return response;
  }

  getTsoportes(user:any, gettoken:any=null){
    if(gettoken != null){
      user.gettoken='true';
    }
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url+'teso14/soportes', params, {headers:headers});
  } 

  setTeso12(user:any):Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url+'teso14/setTeso12',params, {headers:headers});
  }


}

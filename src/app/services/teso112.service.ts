import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Teso114Service } from './teso114.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Teso112Service {
    public url:string

    constructor(private http: HttpClient){
        this.url = global.url;
    }

    getTsoportes(pclave: any){
        const response = new Promise(resolve =>{
            this.http.get(global.url+`teso11/buscar?search=${pclave}`).subscribe(
              data => {
                resolve(data);
              }, err =>{

              });
        });
        return response;
    }

    Exist(user:any):Observable<any>{
      let json = JSON.stringify(user);
      let params = 'json='+json;
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

      return this.http.post(this.url+'teso14/Exists', params, {headers: headers});

    }

    update(user:any, gettoken:any=null):Observable<any>{
      if(gettoken != null){
        user.gettoken = 'true';
      }
      let json = JSON.stringify(user);
      let params = 'json='+json;
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

      return this.http.post(this.url+'teso14/updateTeso11', params,{headers:headers});
    }
    delete(user:any, gettoken:any=null):Observable<any>{
      if(gettoken != null){
        user.gettoken='true';

      }
      let json = JSON.stringify(user);
      let params = 'json='+json;
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

      return this.http.post(this.url+'teso14/deleteTeso11',params, {headers:headers});
    }

    


}
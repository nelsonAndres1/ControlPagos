import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Teso16Service {
  public url:string;
  constructor(private http: HttpClient) {
    this.url=global.url; 
  }

  getUsuarios(pclave: any){
      const response = new Promise(resolve =>{
          this.http.get(global.url+`teso16/search?search=${pclave}`).subscribe(
              data => {
                  resolve(data);
              }, err => {
                  console.log(err);
              });
      });
      return response;
  }
  registerTeso16(user: any): Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url+'teso16/setTeso16', params, {headers: headers});
  }

  deleteTeso16(user: any): Observable<any>{
  
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  
    return this.http.post(this.url+'teso10/deleteTeso16', params, {headers: headers});
  
  }

  listarTeso16(user: any): Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url+'teso16/listarTeso16',params, {headers: headers});
  }


}
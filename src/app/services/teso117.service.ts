import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { observable, Observable } from "rxjs";
import { global } from "./global";


@Injectable()
export class Teso117Service{
    public url: string;
    constructor(public _http: HttpClient){
        this.url=global.url;
    }
    updateTeso13RegisterTeso15(user: any): Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'teso117/updateTeso13Revision',params,{headers:headers});
    
    }
    updateTeso13RegisterTeso15AU(user: any): Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'teso117/updateTeso13Autorizacion',params,{headers:headers});
    
    }
    updateTeso13(user: any): Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'teso117/updateTeso13',params,{headers:headers});
    }

    traerSoportes(user: any): Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'teso117/traerSoportes',params,{headers:headers});
    }

    
}



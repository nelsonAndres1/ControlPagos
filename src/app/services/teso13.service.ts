import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable} from "rxjs";
import { Teso13 } from "../models/teso13";
import { global } from "./global";



@Injectable()
export class Teso13Service{
    public url: string;
    public identity: any;
    public token: any;
    constructor(public _http: HttpClient){
        this.url=global.url;
    }
    test(){
        return "Service Run";
    }

    
    register(user:any): Observable<any>{
        let json =JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'teso13',params,{headers: headers});
    }
    traerConsecutivo(user:any, gettoken:any=null): Observable<any>{
        if(gettoken != null){
            user.gettoken='true';
        }
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        //console.log(this._http.post(this.url+'teso13/consecutivo', params,{headers: headers}));
        return this._http.post(this.url+'teso13/consecutivo', params,{headers: headers}); 
    }
    traerCodClas(user:any): Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'teso13/traerCod', params, {headers: headers});
    }
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity')+'');

        if(identity && identity != 'undefined'){

            if(identity && identity != 'undefined'){
                this.identity = identity;
            }else{
                this.identity = null;
            }
            return this.identity;
        }
    }
    getToken(){
        let token = localStorage.getItem('token');
        if(token && token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }


}
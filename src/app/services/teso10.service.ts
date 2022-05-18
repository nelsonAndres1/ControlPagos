import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable} from "rxjs";
import { teso10 } from "../models/teso10";
import { global } from "./global";
import { catchError } from "rxjs";


@Injectable()
export class Teso10Service{
    public url: string;
    public identity: any;
    public token: any;
    
    constructor(public _http: HttpClient){
            this.url=global.url;
    }

    
    register(user:any): Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'teso10/tpago',params,{headers: headers});
    }

    signup(user:any, gettoken=null):Observable<any>{
        if(gettoken != null){
            user.gettoken = 'true';
        }
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        //console.log(this._http.post(this.url+'teso10',params,{headers:headers}));
        return this._http.post(this.url+'teso10',params,{headers:headers});

    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity')+'');

        if(identity && identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
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
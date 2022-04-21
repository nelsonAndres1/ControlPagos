import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable} from "rxjs";
import { teso10 } from "../models/teso10";
import { global } from "./global";
import { catchError } from "rxjs";


@Injectable()
export class PrincipalService{
    public url: string;

    constructor(public _http: HttpClient){
        this.url=global.url;
    }

    permisos(user:any): Observable<any>{
        
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url+'controller/permisos',params,{headers: headers});

    }

}
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { global } from "./global";
import { Teso114Service } from "./teso114.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Teso110Service{

    public url:string;

    constructor(private http: HttpClient){
        this.url = global.url;
    }

    update(user:any, gettoken:any=null): Observable<any>{
        if(gettoken != null){
            user.gettoken='true';

        }
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        
        return this.http.post(this.url+'teso10/updateTeso10', params, {headers:headers});
    }
    delete(user: any, gettoken:any=null):Observable<any>{
        if(gettoken != null){
            user.gettoken='true';

        }
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this.http.post(this.url+'teso10/deleteTeso10', params, {headers: headers});

    }
}
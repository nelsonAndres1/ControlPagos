import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from "./global";
import { Teso114Service } from "./teso114.service";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    public url: string;

    constructor(private http: HttpClient) {
        this.url = global.url;
    }

    generarPDF(data: any) {

        let json = JSON.stringify(data);
        let params = 'json=' + json;
        console.log("ahaha");
        console.log(params)
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
        return this.http.post(this.url + 'pdf/generarPDF', params, { headers: headers, responseType: 'blob' });
      }
}
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from "./global";
import { Teso114Service } from "./teso114.service";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    public url: string;

    constructor(private http: HttpClient) {
        this.url = global.url;
    }

    upload(formData: FormData): Observable<any> {
        return this.http.post<any>(this.url + 'upload', formData).pipe(
            map(response => response)
        );
    }

    uploadArchivos(formData: FormData): Observable<any> {
        return this.http.post<any>(this.url + 'uploadArchivos', formData).pipe(
            map(response => response)
        );
    }
}
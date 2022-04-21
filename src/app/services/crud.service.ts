import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  baseUrl = environment.baseUrl
  
  constructor(private http:HttpClient) { }

  getAll() {
    return this.http.get(`${this.baseUrl}/getAll.php`);
  }
}

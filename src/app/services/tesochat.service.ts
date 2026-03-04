import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TesoChatService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  private post(endpoint: string, payload: any): Observable<any> {
    let json = JSON.stringify(payload);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + endpoint, params, { headers: headers });
  }

  whoAmI(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.post('chat/whoAmI', { token });
  }

  getConversations(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.post('chat/getConversations', { token });
  }

  getMessages(id_conversacion: number, limit: number = 30, before_id?: number): Observable<any> {
    const token = localStorage.getItem('token');
    const payload: any = { token, id_conversacion, limit };
    if (before_id) payload.before_id = before_id;
    return this.post('chat/getMessages', payload);
  }

  getNewMessages(id_conversacion: number, after_id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.post('chat/getNewMessages', { token, id_conversacion, after_id });
  }

  sendMessage(id_conversacion: number, txt_mensaje: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.post('chat/sendMessage', { token, id_conversacion, txt_mensaje });
  }

  createConversation(titulo: string, tip_conversacion: string, participantes: string[]): Observable<any> {
    const token = localStorage.getItem('token');

    const payload = { token, titulo, tip_conversacion, participantes };

    let json = JSON.stringify(payload);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'chat/createConversation', params, { headers: headers });
  }

  searchUsuario(term: string): Observable<any> {
    const token = localStorage.getItem('token');
    const payload = {token: token, usuper: (term || '').trim()};
    let json = JSON.stringify(payload);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'chat/getSearchUsuario', params, { headers: headers });
  }
}
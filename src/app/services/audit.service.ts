import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { global } from './global';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private url = global.url;
  private lastEventKey = '';
  private lastEventAt = 0;

  constructor(private http: HttpClient) { }

  track(evento: string, detalle: any = {}): void {
    if (!localStorage.getItem('token')) return;

    const payload = {
      evento,
      ruta_front: detalle?.ruta_front || window.location.hash || window.location.pathname,
      modulo: this.moduleFromRoute(detalle?.ruta_front || window.location.hash || window.location.pathname),
      fecha_cliente: new Date().toISOString(),
      detalle: this.sanitize(detalle)
    };

    const eventKey = JSON.stringify({
      evento: payload.evento,
      ruta_front: payload.ruta_front,
      detalle: payload.detalle
    });
    const now = Date.now();

    if (eventKey === this.lastEventKey && now - this.lastEventAt < 400) return;
    this.lastEventKey = eventKey;
    this.lastEventAt = now;

    const params = 'json=' + encodeURIComponent(JSON.stringify(payload));
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post(this.url + 'auditoria/evento', params, { headers }).subscribe({
      error: () => { }
    });
  }

  private sanitize(value: any): any {
    if (value == null) return value;

    if (Array.isArray(value)) {
      return value.slice(0, 25).map(item => this.sanitize(item));
    }

    if (typeof value === 'object') {
      const clean: any = {};
      Object.keys(value).forEach(key => {
        if (this.isSensitiveKey(key)) {
          clean[key] = '[OCULTO]';
          return;
        }
        clean[key] = this.sanitize(value[key]);
      });
      return clean;
    }

    if (typeof value === 'string') {
      return value.length > 300 ? value.substring(0, 300) : value;
    }

    return value;
  }

  private isSensitiveKey(key: string): boolean {
    const normalized = (key || '').toLowerCase();
    return ['clave', 'password', 'token', 'authorization', 'secret'].some(item => normalized.includes(item));
  }

  private moduleFromRoute(route: string): string {
    const clean = (route || '').replace(/^#\/?/, '').replace(/^\//, '');
    return clean.split('/')[0] || '';
  }
}

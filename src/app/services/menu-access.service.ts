import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { global } from './global';

@Injectable({
  providedIn: 'root'
})
export class MenuAccessService {
  private readonly storageKey = 'menuAccessControlPagos';
  public url: string;

  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  private toParams(payload: any) {
    const json = JSON.stringify(payload ?? {});
    const params = 'json=' + encodeURIComponent(json);
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return { params, headers };
  }

  loadProfile(usuario: string): Observable<any> {
    const { params, headers } = this.toParams({ usuario });
    return this.http.post(this.url + 'menu-access/profile', params, { headers }).pipe(
      tap((resp: any) => {
        if (resp?.status === 'success' && resp?.data) {
          localStorage.setItem(this.storageKey, JSON.stringify(resp.data));
        }
      })
    );
  }

  getCatalog(): Observable<any> {
    const { params, headers } = this.toParams({});
    return this.http.post(this.url + 'menu-access/catalog', params, { headers });
  }

  saveRole(payload: any): Observable<any> {
    const { params, headers } = this.toParams(payload);
    return this.http.post(this.url + 'menu-access/saveRole', params, { headers });
  }

  deleteRole(payload: any): Observable<any> {
    const { params, headers } = this.toParams(payload);
    return this.http.post(this.url + 'menu-access/deleteRole', params, { headers });
  }

  getRoleOptions(payload: any): Observable<any> {
    const { params, headers } = this.toParams(payload);
    return this.http.post(this.url + 'menu-access/getRoleOptions', params, { headers });
  }

  saveRoleOptions(payload: any): Observable<any> {
    const { params, headers } = this.toParams(payload);
    return this.http.post(this.url + 'menu-access/saveRoleOptions', params, { headers });
  }

  getUserRoles(payload: any): Observable<any> {
    const { params, headers } = this.toParams(payload);
    return this.http.post(this.url + 'menu-access/getUserRoles', params, { headers });
  }

  assignUserRole(payload: any): Observable<any> {
    const { params, headers } = this.toParams(payload);
    return this.http.post(this.url + 'menu-access/assignUserRole', params, { headers });
  }

  removeUserRole(payload: any): Observable<any> {
    const { params, headers } = this.toParams(payload);
    return this.http.post(this.url + 'menu-access/removeUserRole', params, { headers });
  }

  searchUsers(search: string) {
    return this.http.get(this.url + `menu-access/searchUsers?search=${encodeURIComponent(search)}`);
  }

  getStoredProfile(): any {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getOptionKeys(): string[] {
    return this.getStoredProfile()?.option_keys ?? [];
  }

  getRoleCodes(): string[] {
    return this.getStoredProfile()?.roles ?? [];
  }

  hasAccess(optionKey: string): boolean {
    return this.getOptionKeys().includes(optionKey);
  }

  setFallbackProfile(usuario: string): void {
    const optionKeys = ['principal', 'teso15_status', 'teso15_nit', 'chat'];
    localStorage.setItem(this.storageKey, JSON.stringify({
      usuario,
      roles: [],
      option_keys: optionKeys,
      menu_options: optionKeys.map((key) => ({ key })),
      fallback_consulta: true,
      legacy_permissions: []
    }));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, switchMap, catchError, of, map } from 'rxjs';

type AppVersion = { builtAt: string; commit?: string };

@Injectable({ providedIn: 'root' })
export class AppVersionService {
  private http = inject(HttpClient);
  private current?: AppVersion;

  init(pollMs = 60_000) { // cada 60s; ajústalo
    // Carga inicial para conocer la versión actual
    this.fetchVersion().subscribe(v => this.current = v);

    // Polling
    timer(pollMs, pollMs)
      .pipe(switchMap(() => this.fetchVersion()))
      .subscribe(v => {
        if (this.current && v && (v.builtAt !== this.current.builtAt || v.commit !== this.current.commit)) {
          // O muestra un toast antes:
          // this.toastr.info('Hay una nueva versión', 'Actualizar');
          location.reload(); // recargar para tomar el nuevo index + bundles
        }
      });
  }

  private fetchVersion() {
    const url = `/assets/version.json?t=${Date.now()}`; // cache-busting
    return this.http.get<AppVersion>(url).pipe(
      catchError(() => of(undefined as unknown as AppVersion))
    );
  }
}

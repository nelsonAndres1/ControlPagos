import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global"; // debe tener: global.url = 'http://TU_HOST/api/'

export interface TableroValores {
    suma_valores: number;
    promedio_valores: number;
    min_valor: number;
    max_valor: number;
}

@Injectable({ providedIn: 'root' })
export class TableroService {
    private base = global.url; // ej: 'http://localhost:8000/api/'

    constructor(private http: HttpClient) { }

    /** Headers JSON; agrega token si lo manejas */
    private headers(token?: string): HttpHeaders {
        let h = new HttpHeaders().set('Content-Type', 'application/json');
        if (token) h = h.set('Authorization', `Bearer ${token}`);
        return h;
    }

    /**
     * Normaliza filtros: acepta string CSV, string simple o array (estado, nit, coddep, codcen).
     * El backend acepta cualquiera de estos formatos.
     */
    private buildPayload(body: {
        valor?: string;
        estado?: string | string[];
        nit?: string | string[];
        coddep?: string | string[];
        codcen?: string | string[];
    }) {
        const normalize = (v: any) =>
            Array.isArray(v) ? v : (typeof v === 'string' && v.includes(',')) ? v.split(',').map(s => s.trim()) : v;

        const payload: any = {};
        if (body.valor != null && body.valor !== '') payload.valor = String(body.valor);
        if (body.estado != null) payload.estado = normalize(body.estado);
        if (body.nit != null) payload.nit = normalize(body.nit);
        if (body.coddep != null) payload.coddep = normalize(body.coddep);
        if (body.codcen != null) payload.codcen = normalize(body.codcen);
        return payload;
    }

    /** POST /teso13/{dim}/total  (dim = nit | coddep | codcen | perfac) */
    postTotal(
        dim: 'nit' | 'coddep' | 'codcen' | 'perfac',
        body: { valor?: string; estado?: string | string[]; nit?: string | string[]; coddep?: string | string[]; codcen?: string | string[] },
        token?: string
    ): Observable<{ total_facturas: number } | Array<{ [k: string]: any, total_facturas: number }>> {
        const url = `${this.base}teso13/${dim}/total`;
        return this.http.post(url, this.buildPayload(body), { headers: this.headers(token) }) as any;
    }

    /** POST /teso13/{dim}/estados  (requiere body.valor) */
    postEstados(
        dim: 'nit' | 'coddep' | 'codcen' | 'perfac',
        body: { valor: string; estado?: string | string[]; nit?: string | string[]; coddep?: string | string[]; codcen?: string | string[] },
        token?: string
    ): Observable<Array<{ estado: string | null, total: number }>> {
        const url = `${this.base}teso13/${dim}/estados`;
        return this.http.post<Array<{ estado: string | null, total: number }>>(url, this.buildPayload(body), { headers: this.headers(token) });
    }

    /** POST /teso13/{dim}/valores  (requiere body.valor) */
    postValores(
        dim: 'nit' | 'coddep' | 'codcen' | 'perfac',
        body: { valor: string; estado?: string | string[]; nit?: string | string[]; coddep?: string | string[]; codcen?: string | string[] },
        token?: string
    ): Observable<TableroValores> {
        const url = `${this.base}teso13/${dim}/valores`;
        return this.http.post<TableroValores>(url, this.buildPayload(body), { headers: this.headers(token) });
    }
}

import { Component, OnInit, DoCheck } from '@angular/core';
import { Gener02Service } from '../services/gener02.service';
import { Teso13Service } from '../services/teso13.service';
import { Teso22Service } from '../services/teso22.service';
import { PagoPendiente } from '../models/pago-pendiente.model';
import Swal from 'sweetalert2';

type Pago = {
    codclas: string;
    numero: string;
    estado_actual_txt: string;
    nombre_estado_actual: string;
    flujo: string;
    prioridad: 'A' | 'B' | 'M' | string;
    detclas: string;
};

type Prio = 'A' | 'B' | 'M';
type PaginationState = { pageSize: number; currentPage: number; window: number };
@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css'],
    providers: [Gener02Service, Teso13Service, Teso22Service]
})

export class PrincipalComponent implements OnInit {
    pagosPendientes: PagoPendiente[] = [];

    pagosA: PagoPendiente[] = [];
    pagosB: PagoPendiente[] = [];
    pagosM: PagoPendiente[] = [];


    pag: Record<Prio, PaginationState> = {
        A: { pageSize: 5, currentPage: 1, window: 5 },
        B: { pageSize: 5, currentPage: 1, window: 5 },
        M: { pageSize: 5, currentPage: 1, window: 5 }
    };

    cargando = false;
    errorMsg = '';
    identity: any;
    token: any;
    constructor(public _gener02Service: Gener02Service, public _teso13Service: Teso13Service, public _teso22Service: Teso22Service) {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();

        this.getPagosPendientes();
    }

    ngOnInit(): void {
        this.getPagosPendientes();
    }

    getPagosPendientes(): void {
        this.cargando = true;
        this._teso22Service.getPagosPendientes({}).subscribe({
            next: (response: any) => {
                // Tu backend a veces devuelve el array directo, otras {rows:[]}.
                const data: PagoPendiente[] =
                    Array.isArray(response) ? response :
                        response?.rows ?? response?.data ?? [];

                // Normalización visual mínima (opcional)
                const clean = (s: any) => (typeof s === 'string' ? s.replace(/\u00A0/g, ' ').trim() : s);

                this.pagosPendientes = (data || []).map(p => ({
                    ...p,
                    numero: clean(p.numero),
                    nombre_estado_actual: clean(p.nombre_estado_actual),
                    detclas: clean(p.detclas),
                    flujo: clean(p.flujo),
                    estado_actual_txt: clean(p.estado_actual_txt),
                    codclas: clean(p.codclas),
                    prioridad: clean(p.prioridad)
                }));

                // Divide por prioridad
                this.pagosA = this.pagosPendientes.filter(p => p.prioridad === 'A');
                this.pagosB = this.pagosPendientes.filter(p => p.prioridad === 'B');
                this.pagosM = this.pagosPendientes.filter(p => p.prioridad === 'M');

                // (Opcional) Ordenar por codclas ASC, numero DESC
                const sortFn = (a: PagoPendiente, b: PagoPendiente) =>
                    a.codclas.localeCompare(b.codclas) || b.numero.localeCompare(a.numero);

                this.pagosA.sort(sortFn);
                this.pagosB.sort(sortFn);
                this.pagosM.sort(sortFn);

                this.cargando = false;
            },
            error: (err) => {
                this.errorMsg = 'Error cargando pagos pendientes';
                console.error(err);
                this.cargando = false;
            }
        });
    }
    // pagos-pendientes.component.ts (añade esto al componente)
    priorityBadge(prio: string): string {
        switch (prio) {
            case 'A': return 'badge-prio-a';
            case 'B': return 'badge-prio-b';
            case 'M': return 'badge-prio-m';
            default: return 'badge-prio-x';
        }
    }

    estadoChip(estadoTxt: string): string {
        // Puedes personalizar chips por estado si quieres
        // Ejemplos: 113=Radicado, 158=Causación, 163=Causación pago, 166=Rev Tesorería, 173=Aprobación, etc.
        const e = (estadoTxt || '').trim();
        if (e === '113') return 'chip chip-blue';
        if (e === '120') return 'chip chip-teal';
        if (e === '158') return 'chip chip-purple';
        if (e === '163') return 'chip chip-green';
        if (e === '166') return 'chip chip-amber';
        if (e === '173') return 'chip chip-orange';
        return 'chip chip-gray';
    }



    // -------- utilidades de paginación por prioridad --------
    totalItems(prio: Prio): number {
        const list = this.listFor(prio);
        return list?.length ?? 0;
    }
    totalPages(prio: Prio): number {
        return Math.max(1, Math.ceil(this.totalItems(prio) / this.pag[prio].pageSize));
    }
    startIndex(prio: Prio): number {
        return (this.pag[prio].currentPage - 1) * this.pag[prio].pageSize;
    }
    endIndex(prio: Prio): number {
        const end = this.startIndex(prio) + this.pag[prio].pageSize;
        return Math.min(end, this.totalItems(prio));
    }
    pagedData(prio: Prio): Pago[] {
        const list = this.listFor(prio) || [];
        return list.slice(this.startIndex(prio), this.endIndex(prio));
    }
    pagesToShow(prio: Prio): number[] {
        const { window } = this.pag[prio];
        const half = Math.floor(window / 2);
        let start = Math.max(1, this.pag[prio].currentPage - half);
        let end = Math.min(this.totalPages(prio), start + window - 1);
        start = Math.max(1, end - window + 1);
        const pages: number[] = [];
        for (let p = start; p <= end; p++) pages.push(p);
        return pages;
    }
    setPageSize(prio: Prio, size: number) {
        this.pag[prio].pageSize = Number(size) || 10;
        this.pag[prio].currentPage = 1;
    }
    goToPage(prio: Prio, p: number) {
        this.pag[prio].currentPage = Math.min(Math.max(1, p), this.totalPages(prio));
    }
    next(prio: Prio) { this.goToPage(prio, this.pag[prio].currentPage + 1); }
    prev(prio: Prio) { this.goToPage(prio, this.pag[prio].currentPage - 1); }

    // helpers
    private listFor(prio: Prio): Pago[] {
        if (prio === 'A') return this.pagosA;
        if (prio === 'B') return this.pagosB;
        return this.pagosM;
    }
    trackByClave = (_: number, p: Pago) => `${p.codclas}-${p.numero}`;

}

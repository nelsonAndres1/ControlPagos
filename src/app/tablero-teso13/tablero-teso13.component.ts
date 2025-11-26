import { Component } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { TableroService, TableroValores } from '../services/tablero.service';
import { Teso20Service } from '../services/teso20.service';
import { ReporteService } from '../services/reporte.service';

type Dim = 'nit' | 'coddep' | 'codcen' | 'perfac';

@Component({
  selector: 'app-tablero-teso13',
  templateUrl: './tablero-teso13.component.html',
  providers: [Teso20Service, ReporteService]
})
export class TableroTeso13Component {
  // ===== Filtros =====
  // ===== Filtros =====
  dim: Dim = 'nit';
  valor = '';

  estadosSeleccionados: string[] = [];
  estadoCsv = '';

  nit = '';
  coddep = '';
  codcen = '';

  // rango de fechas por teso13.fecrad
  fecradIni = ''; // YYYY-MM-DD
  fecradFin = ''; // YYYY-MM-DD


  // ===== Catálogos =====
  estadosTeso20: any[] = [];
  dataConta06: any[] = []; // Áreas
  dataConta28: any[] = []; // Dependencias

  // ===== Datos / UI =====
  loading = false;
  errorMsg = '';

  totalFacturas: number | null = null;
  totalListado: Array<any> = []; // agrupado por dimensión cuando no se envía "valor"
  estadosRows: Array<{ estado: string | null; total: number }> = [];
  valores: TableroValores | null = null;

  constructor(
    private tablero: TableroService,
    private _teso20Service: Teso20Service,
    private _reporteService: ReporteService
  ) {
    this.getAllTeso20();
    this.getConta06();
    this.getConta28();
  }

  // ---------- CATALOGOS ----------
  getConta06() {
    this._reporteService.getConta06({}).subscribe(res => {
      this.dataConta06 = res?.areas_pago || [];
    });
  }

  getAllTeso20() {
    this._teso20Service.getAll({}).subscribe(res => {
      this.estadosTeso20 = Array.isArray(res) ? res : [];
    });
  }

  getConta28() {
    this._reporteService.getConta28({}).subscribe(res => {
      this.dataConta28 = res?.areas_pago || [];
    });
  }

  // ---------- DINÁMICO (Valor de la dimensión) ----------
  onDimChange(newDim: Dim) {
    this.dim = newDim;
    // Limpia valor y evita arrastrar filtros de otra dimensión
    this.valor = '';
    if (newDim !== 'coddep') this.coddep = '';
    if (newDim !== 'codcen') this.codcen = '';
  }

  onSelectCoddep(coddep: string) {
    this.valor = coddep;   // valor de la dimensión
    this.coddep = coddep;  // sincroniza filtro secundario
  }

  onSelectCodcen(codcen: string) {
    this.valor = codcen;   // valor de la dimensión
    this.codcen = codcen;  // sincroniza filtro secundario
  }

  // ---------- helpers de inputs ----------
  onNitBlur() {
    this.valor = (this.valor || '').trim();
  }

  onPerfacChange(v: string) {
    // Solo dígitos, máximo 6 (YYYYMM)
    this.valor = (v || '').replace(/\D+/g, '').slice(0, 6);
  }

  // Tamaño del multiselect de estados (no usar Math en template)
  get estadosSize(): number {
    const len = this.estadosTeso20?.length ?? 0;
    return Math.min(8, len || 6);
  }

  // ---------- HELPERS ----------
  /** Multiselect -> CSV para backend */
  syncEstadosCsv() {
    const uniq = Array.from(new Set(this.estadosSeleccionados.filter(Boolean)));
    this.estadoCsv = uniq.join(',');
  }

  /** Normaliza inputs antes de armar el body */
  private sanitize() {
    this.valor = (this.valor || '').trim();
    this.nit = (this.nit || '').replace(/\s+/g, '');
    this.coddep = (this.coddep || '').trim();
    this.codcen = (this.codcen || '').trim();

    if (this.dim === 'perfac') {
      // YYYYMM, solo dígitos
      this.valor = this.valor.replace(/\D+/g, '').slice(0, 6);
    }

    this.syncEstadosCsv();
  }

  private buildBody() {
    this.sanitize();
    const body: any = {
      valor: this.valor || undefined,
      estado: this.estadoCsv || undefined, // CSV: "RA,PE,AP"
      nit: this.nit || undefined,
      coddep: this.coddep || undefined,
      codcen: this.codcen || undefined
    };
    if (this.fecradIni) {
      body.fecrad_ini = this.fecradIni;
    }
    if (this.fecradFin) {
      body.fecrad_fin = this.fecradFin;
    }
    return body;
  }


  limpiar() {
    this.errorMsg = '';
    this.totalFacturas = null;
    this.totalListado = [];
    this.estadosRows = [];
    this.valores = null;

    this.valor = '';
    this.estadosSeleccionados = [];
    this.estadoCsv = '';
    this.nit = '';
    this.coddep = '';
    this.codcen = '';
    this.fecradIni = '';
    this.fecradFin = '';
  }


  private humanizeError(err: any): string {
    if (typeof err === 'string') return err;
    if (err?.error?.message) return err.error.message;
    return 'Error consultando el tablero.';
  }

  // ---------- CONSULTAS ----------
  consultarTotal() {
    /* this.limpiar(); */

    console.log('consultarTotal', this.dim);

    this.loading = true;
    const body = this.buildBody();

    this.tablero.postTotal(this.dim, body)
      .pipe(
        finalize(() => this.loading = false),
        catchError(err => {
          this.errorMsg = this.humanizeError(err);
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (!res) return;
        if (Array.isArray(res)) {
          this.totalListado = res;
          this.totalFacturas = null;
        } else {
          this.totalFacturas = res?.total_facturas ?? 0;
        }
      });
  }

  consultarEstados() {
    if (!this.valor) {
      this.errorMsg = 'Para "Estados" debes indicar "valor" de la dimensión.';
      return;
    }
    this.errorMsg = '';
    this.estadosRows = [];
    this.loading = true;
    const body = this.buildBody();

    this.tablero.postEstados(this.dim, body as any)
      .pipe(
        finalize(() => this.loading = false),
        catchError(err => {
          this.errorMsg = this.humanizeError(err);
          return of([]);
        })
      )
      .subscribe(rows => this.estadosRows = rows || []);
  }

  consultarValores() {
    if (!this.valor) {
      this.errorMsg = 'Para "Valores" debes indicar "valor" de la dimensión.';
      return;
    }
    this.errorMsg = '';
    this.valores = null;
    this.loading = true;
    const body = this.buildBody();

    this.tablero.postValores(this.dim, body as any)
      .pipe(
        finalize(() => this.loading = false),
        catchError(err => {
          this.errorMsg = this.humanizeError(err);
          return of(null);
        })
      )
      .subscribe(kpis => {
        this.valores = kpis || { suma_valores: 0, promedio_valores: 0, min_valor: 0, max_valor: 0 };
      });
  }

  consultarTodo() {
    this.errorMsg = '';
    this.loading = true;
    this.totalFacturas = null;
    this.totalListado = [];
    this.estadosRows = [];
    this.valores = null;

    const body = this.buildBody();

    const reqTotal = this.tablero.postTotal(this.dim, body).pipe(
      catchError(err => {
        this.errorMsg = this.errorMsg || this.humanizeError(err);
        return of(null);
      })
    );

    const reqEstados = this.valor
      ? this.tablero.postEstados(this.dim, body as any).pipe(
        catchError(err => {
          this.errorMsg = this.errorMsg || this.humanizeError(err);
          return of([]);
        })
      )
      : of([]);

    const reqValores = this.valor
      ? this.tablero.postValores(this.dim, body as any).pipe(
        catchError(err => {
          this.errorMsg = this.errorMsg || this.humanizeError(err);
          return of(null);
        })
      )
      : of(null);

    forkJoin([reqTotal, reqEstados, reqValores])
      .pipe(finalize(() => this.loading = false))
      .subscribe(([resTotal, rowsEstados, kpisValores]) => {
        if (Array.isArray(resTotal)) {
          this.totalListado = resTotal;
        } else if (resTotal) {
          this.totalFacturas = resTotal?.total_facturas ?? 0;
        }
        this.estadosRows = rowsEstados || [];
        this.valores = kpisValores || (this.valor
          ? { suma_valores: 0, promedio_valores: 0, min_valor: 0, max_valor: 0 }
          : null);
      });
  }

  // ---------- Chips visibles ----------
  get activeFilters(): string[] {
    const chips: string[] = [];
    if (this.valor) chips.push(`${this.dim.toUpperCase()}: ${this.valor}`);
    if (this.estadoCsv) chips.push(`ESTADO(S): ${this.estadoCsv}`);
    if (this.nit) chips.push(`NIT: ${this.nit}`);
    if (this.coddep) chips.push(`CODDEP: ${this.coddep}`);
    if (this.codcen) chips.push(`CODCEN: ${this.codcen}`);

    if (this.fecradIni || this.fecradFin) {
      const ini = this.fecradIni || '...';
      const fin = this.fecradFin || '...';
      chips.push(`FECRAD: ${ini} a ${fin}`);
    }

    return chips;
  }


  // ---------- Getters para el dashboard ----------
  get kpiTotalFacturas(): number {
    if (this.totalFacturas !== null) return this.totalFacturas;
    if (Array.isArray(this.totalListado) && this.totalListado.length) {
      return this.totalListado.reduce((acc, r) => acc + (Number(r?.total_facturas) || 0), 0);
    }
    return 0;
  }

  get kpiSuma(): number { return Number(this.valores?.suma_valores) || 0; }
  get kpiPromedio(): number { return Number(this.valores?.promedio_valores) || 0; }
  get kpiMin(): number { return Number(this.valores?.min_valor) || 0; }
  get kpiMax(): number { return Number(this.valores?.max_valor) || 0; }

  get estadosTotal(): number {
    return (this.estadosRows || []).reduce((s, e) => s + (Number(e?.total) || 0), 0);
  }

  get estadosDistrib(): Array<{ estado: string; total: number; pct: number }> {
    const total = this.estadosTotal || 1;
    return [...(this.estadosRows || [])]
      .map(e => ({
        estado: e?.estado ?? '(NULL)',
        total: Number(e?.total) || 0,
        pct: Math.round(((Number(e?.total) || 0) * 10000) / total) / 100
      }))
      .sort((a, b) => b.total - a.total);
  }

  get top3Grupos(): Array<{ key: string; total: number; pct: number }> {
    const data = Array.isArray(this.totalListado) ? this.totalListado : [];
    const tot = this.kpiTotalFacturas || 1;
    return [...data]
      .map(r => ({ key: String(r?.[this.dim] ?? ''), total: Number(r?.total_facturas) || 0 }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map(x => ({ ...x, pct: Math.round((x.total * 10000) / tot) / 100 }));
  }

  // ---------- trackBy helpers ----------
  trackByIndex = (_: number, __: any) => _;
  trackByRow = (_: number, row: any) => row?.[this.dim] ?? _;
  trackByEstadoRow = (_: number, row: any) => row?.estado ?? _;
  trackByEstado = (_: number, est: any) => est?.id ?? _;
  trackByCoddep = (_: number, est: any) => est?.coddep ?? _;
  trackByCodcen = (_: number, est: any) => est?.codcen ?? _;
}

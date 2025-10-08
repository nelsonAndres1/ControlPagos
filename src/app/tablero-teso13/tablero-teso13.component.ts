import { Component } from '@angular/core';
import { TableroService, TableroValores } from '../services/tablero.service'; // ajusta la ruta si es necesario

type Dim = 'nit' | 'coddep' | 'codcen' | 'perfac';

@Component({
  selector: 'app-tablero-teso13',
  templateUrl: './tablero-teso13.component.html'
})
export class TableroTeso13Component {
  // Filtros
  dim: Dim = 'nit';
  valor: string = '';

  estado: string = ''; // CSV o vacío
  nit: string = '';
  coddep: string = '';
  codcen: string = '';

  // Datos
  loading = false;
  errorMsg = '';

  totalFacturas: number | null = null;
  totalListado: Array<any> = []; // cuando no se manda "valor", viene listado agrupado

  estadosRows: Array<{ estado: string | null; total: number }> = [];
  valores: TableroValores | null = null;

  constructor(private tablero: TableroService) { }

  // Construye el body para POST (el servicio ya normaliza CSV → array si hace falta)
  private buildBody() {
    return {
      valor: this.valor || undefined,
      estado: this.estado || undefined,   // puede ser "RA,PE" o "" (no enviar)
      nit: this.nit || undefined,
      coddep: this.coddep || undefined,
      codcen: this.codcen || undefined
    };
  }

  limpiar() {
    this.errorMsg = '';
    this.totalFacturas = null;
    this.totalListado = [];
    this.estadosRows = [];
    this.valores = null;
  }

  consultarTotal() {
    this.limpiar();
    this.loading = true;
    this.tablero.postTotal(this.dim, this.buildBody()).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Si enviaste "valor", backend responde { total_facturas: number }
        // Si NO enviaste "valor", responde un array agrupado por dim
        if (Array.isArray(res)) {
          this.totalListado = res;
          this.totalFacturas = null;
        } else {
          this.totalFacturas = res?.total_facturas ?? 0;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.humanizeError(err);
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
    this.tablero.postEstados(this.dim, this.buildBody() as any).subscribe({
      next: (rows) => {
        this.loading = false;
        this.estadosRows = rows || [];
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.humanizeError(err);
      }
    });
  }

  consultarValores() {
    if (!this.valor) {
      this.errorMsg = 'Para "Valores" debes indicar "valor" de la dimensión.';
      return;
    }
    this.errorMsg = '';
    this.valores = null;
    this.loading = true;
    this.tablero.postValores(this.dim, this.buildBody() as any).subscribe({
      next: (kpis) => {
        this.loading = false;
        this.valores = kpis || { suma_valores: 0, promedio_valores: 0, min_valor: 0, max_valor: 0 };
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.humanizeError(err);
      }
    });
  }

  consultarTodo() {
    this.errorMsg = '';
    this.loading = true;
    this.totalFacturas = null;
    this.totalListado = [];
    this.estadosRows = [];
    this.valores = null;

    // Dispara en paralelo
    const body = this.buildBody();

    // total
    this.tablero.postTotal(this.dim, body).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.totalListado = res;
        } else {
          this.totalFacturas = res?.total_facturas ?? 0;
        }
      },
      error: (err) => this.errorMsg = this.errorMsg || this.humanizeError(err)
    });

    // estados (requiere valor)
    if (this.valor) {
      this.tablero.postEstados(this.dim, body as any).subscribe({
        next: (rows) => this.estadosRows = rows || [],
        error: (err) => this.errorMsg = this.errorMsg || this.humanizeError(err)
      });

      // valores
      this.tablero.postValores(this.dim, body as any).subscribe({
        next: (kpis) => this.valores = kpis || { suma_valores: 0, promedio_valores: 0, min_valor: 0, max_valor: 0 },
        error: (err) => this.errorMsg = this.errorMsg || this.humanizeError(err)
      });
    }

    // Marcar fin (pequeño delay para UX)
    setTimeout(() => this.loading = false, 300);
  }

  private humanizeError(err: any): string {
    if (typeof err === 'string') return err;
    if (err?.error?.message) return err.error.message;
    return 'Error consultando el tablero.';
  }
  // ... tu código actual arriba

  get activeFilters(): string[] {
    const chips: string[] = [];
    if (this.valor) chips.push(`${this.dim.toUpperCase()}: ${this.valor}`);
    if (this.estado) chips.push(`ESTADO: ${this.estado}`);
    if (this.nit) chips.push(`NIT: ${this.nit}`);
    if (this.coddep) chips.push(`CODDEP: ${this.coddep}`);
    if (this.codcen) chips.push(`CODCEN: ${this.codcen}`);
    return chips;
  }

}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Reporte } from '../models/reporte';
import { Teso10Service } from '../services/teso10.service';
import { ReporteService } from '../services/reporte.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [Teso10Service, ReporteService]
})
export class ReportesComponent implements OnInit {
  reporte: Reporte;
  teso10: any[] = [];
  causadores: any[] = [];
  loading = false;

  constructor(
    private _teso10Service: Teso10Service,
    private _reporteService: ReporteService
  ) {
    // Ajusta al modelo que usas; aquí dejo el placeholder con “-”
    this.reporte = new Reporte('-', '-', '-', '-', '-');
  }

  ngOnInit(): void {
    this.getTiposPago();
    this.getUsucau();
  }

  getTiposPago(): void {
    this._teso10Service.signup(this.reporte).subscribe({
      next: (resp) => {
        this.teso10 = Array.isArray(resp) ? resp : [];
        // console.log('teso10', this.teso10);
      },
      error: (err) => {
        console.error('Error cargando TESO10:', err);
        this.teso10 = [];
      }
    });
  }

  getUsucau(): void {
    this._reporteService.getUsucau(this.reporte).subscribe({
      next: (resp) => {
        this.causadores = Array.isArray(resp) ? resp : [];
      },
      error: (err) => {
        console.error('Error cargando causadores:', err);
        this.causadores = [];
      }
    });
  }

  registerReportes(form: NgForm): void {
    if (form.invalid || this.loading) return;

    this.loading = true;
    this._reporteService.Reportes(this.reporte).subscribe({
      next: (resp) => {
        // console.log('reporte!', resp);
        try {
          this._reporteService.dowloadExcel(resp);
        } catch (e) {
          console.error('Error al descargar Excel:', e);
        } finally {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error en reporte:', err);
        this.loading = false;
      }
    });
  }
}

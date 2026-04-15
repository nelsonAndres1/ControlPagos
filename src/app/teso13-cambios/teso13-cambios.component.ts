import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Teso13Service } from '../services/teso13.service';

@Component({
  selector: 'app-teso13-cambios',
  templateUrl: './teso13-cambios.component.html',
  styleUrls: ['./teso13-cambios.component.css'],
  providers: [Teso13Service]
})
export class Teso13CambiosComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  keyword = '';
  loading = false;
  pagos: any[] = [];
  selectedRow: number | null = null;
  historialByPago: { [key: string]: any[] } = {};
  detailLoadingByPago: { [key: string]: boolean } = {};

  constructor(private _teso13Service: Teso13Service) { }

  ngOnInit(): void {
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 0);
    this.consultar();
  }

  onSearchChange(event: any): void {
    const value = (event?.target?.value || '').toString();
    this.keyword = value;
  }

  onEnter(event: any): void {
    const value = (event?.target?.value || '').toString();
    this.keyword = value;
    if (!this.loading) {
      this.consultar();
    }
  }

  consultar(): void {
    this.loading = true;
    this.pagos = [];
    this.selectedRow = null;
    this.historialByPago = {};
    this.detailLoadingByPago = {};

    const payload = {
      keyword: (this.keyword || '').toString().trim()
    };

    this._teso13Service.getPagosConCambios(payload).subscribe(
      (response: any) => {
        this.pagos = Array.isArray(response) ? response : [];
      },
      (_error: any) => {
        Swal.fire('Error', 'No fue posible consultar los pagos con modificaciones.', 'error');
      },
      () => {
        this.loading = false;
      }
    );
  }

  consultarDetalle(index: number, item: any): void {
    const key = (item?.numero_pago || '').toString();
    if (!key) {
      return;
    }

    if (this.selectedRow === index) {
      this.selectedRow = null;
      return;
    }

    this.selectedRow = index;

    if (this.historialByPago[key]) {
      return;
    }

    this.detailLoadingByPago[key] = true;

    this._teso13Service.getHistorialCambios({
      codclas: item.codclas,
      numero: item.numero
    }).subscribe(
      (response: any) => {
        this.historialByPago[key] = Array.isArray(response) ? response : [];
      },
      (_error: any) => {
        this.historialByPago[key] = [];
        Swal.fire('Error', 'No fue posible consultar el detalle de modificaciones.', 'error');
      },
      () => {
        this.detailLoadingByPago[key] = false;
      }
    );
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Teso15Service } from '../services/teso15.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso17',
  templateUrl: './teso17.component.html',
  styleUrls: ['./teso17.component.css'],
  providers: [Teso15Service]
})
export class Teso17Component implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  data: any[] = [];
  data1: any;
  loading = false;        // bloquea input mientras consulta
  autoNavigated = false;  // evita navegar más de una vez por la misma búsqueda

  constructor(
    private _teso15Service: Teso15Service,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.focusSearchInput();
  }

  private focusSearchInput(): void {
    // pequeño defer por si el control aún no está listo
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 0);
  }

  /** Normaliza a dígitos y limita a 10 */
  private sanitizeTo10Digits(raw: string): string {
    const digits = (raw || '').replace(/\D+/g, '');
    return digits.slice(0, 10);
  }

  onSearchChange(event: any): void {
    const value = this.sanitizeTo10Digits(event?.target?.value);
    // Refleja el valor sanitizado en el input (opcional pero útil)
    if (this.searchInput?.nativeElement?.value !== value) {
      this.searchInput.nativeElement.value = value;
    }

    if (value.length === 10 && !this.loading && !this.autoNavigated) {
      this.getTpagoByKeyword(value, /*autoNavigate*/ true);
    } else if (value.length < 10) {
      // si el usuario borra, permite una nueva navegación al completar nuevamente 10
      this.autoNavigated = false;
      this.data = []; // opcional: limpiar resultados al borrar
    }
  }

  /** Permite Enter como disparador cuando ya hay 10 dígitos */
  onEnter(event: any): void {
    const value = this.sanitizeTo10Digits(event?.target?.value);
    if (value.length === 10 && !this.loading) {
      this.getTpagoByKeyword(value, /*autoNavigate*/ true);
    }
  }

  /** Llama al servicio con control de estados y navega al primer resultado */
  private getTpagoByKeyword(keyword: string, autoNavigate = false): void {
    this.loading = true;

    // (Opcional) mostrar un spinner modal:
    // Swal.fire({ title: 'Buscando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    this._teso15Service.getTPago(keyword).then(
      (response: any) => {
        // Estructura asumida: response[1] contiene el arreglo de resultados
        this.data = Array.isArray(response?.[1]) ? response[1] : [];
        this.data1 = response;

        if (autoNavigate && this.data.length > 0 && !this.autoNavigated) {
          this.autoNavigated = true;
          const first = this.data[0];
          this.getDetailPage(first, this.data1);
        } else if (autoNavigate && this.data.length === 0) {
          Swal.fire('Información', 'No se encontraron resultados para ese número.', 'info');
        }
      },
      (_err: any) => {
        Swal.fire('Información', 'Error inesperado', 'error');
      }
    ).finally(() => {
      this.loading = false;
      // (Opcional) cerrar spinner modal:
      // Swal.close();
    });
  }

  /** Mantén esta wrapper si en otros lugares se llama con el $event */
  getTpago(pclave: any): void {
    const keyword = this.sanitizeTo10Digits(pclave?.target?.value);
    if (keyword.length === 10) {
      this.getTpagoByKeyword(keyword, /*autoNavigate*/ true);
    }
  }

  getDetailPage(result: any, data: any): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        res2: JSON.stringify(data)
      }
    };
    this.router.navigate(['teso117/super'], navigationExtras);
  }
}

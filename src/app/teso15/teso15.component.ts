import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Teso15Service } from '../services/teso15.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso15',
  templateUrl: './teso15.component.html',
  styleUrls: ['./teso15.component.css'],
  providers: [Teso15Service]
})
export class Teso15Component implements OnInit {
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
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 0);
  }

  /** Normaliza a dígitos y limita a 10 */
  private sanitizeTo10Digits(raw: string): string {
    const digits = (raw || '').replace(/\D+/g, '');
    return digits.slice(0, 10);
  }

  /** Input en tiempo real: dispara búsqueda automática al llegar a 10 dígitos */
  onSearchChange(event: any): void {
    const value = this.sanitizeTo10Digits(event?.target?.value);

    // reflejar el valor sanitizado en el input (por si pegan espacios o letras)
    if (this.searchInput?.nativeElement?.value !== value) {
      this.searchInput.nativeElement.value = value;
    }

    if (value.length === 10 && !this.loading && !this.autoNavigated) {
      this.getTpagoByKeyword(value, /*autoNavigate*/ true);
    } else if (value.length < 10) {
      this.autoNavigated = false; // permite navegar de nuevo cuando completen 10 otra vez
      this.data = [];             // opcional: limpia resultados parciales
    }
  }

  /** Permite Enter como disparador cuando ya hay 10 dígitos */
  onEnter(event: any): void {
    const value = this.sanitizeTo10Digits(event?.target?.value);
    if (value.length === 10 && !this.loading) {
      this.getTpagoByKeyword(value, /*autoNavigate*/ true);
    }
  }

  /** Llama al servicio y (opcional) navega a primer resultado cuando hay datos */
  private getTpagoByKeyword(keyword: string, autoNavigate = false): void {
    this.loading = true;

    this._teso15Service.getTPago(keyword).then(
      (response: any) => {
        // Asumiendo estructura: response[1] es arreglo de resultados
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
        Swal.fire('Información', 'Error inesperado al consultar.', 'error');
      }
    ).finally(() => {
      this.loading = false;
    });
  }

  /** Compatibilidad con el método original que recibía el $event */
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
    this.router.navigate(['teso16'], navigationExtras);
  }
}

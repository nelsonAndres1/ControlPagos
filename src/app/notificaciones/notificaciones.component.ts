import { Component, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

import { Teso18Service } from '../services/teso18.service';
import { Notificacion } from '../models/notificacion';
import { Teso10Service } from '../services/teso10.service';
import { Teso20Service } from '../services/teso20.service';
import { Teso24Service } from '../services/teso24.service';
import { Gener02Service } from '../services/gener02.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  providers: [Teso18Service, Teso10Service, Teso20Service, Teso24Service]
})
export class NotificacionesComponent {
  identity: any;
  usuarios: any = [];
  notificacion: Notificacion;
  pagos: any;
  data_teso20: any = [];
  data_notificacion: any = [];
  bandera_actualizar = false;
  debounceTimer: any;

  // nuevas selecciones múltiples
  pagosSel: string[] = [];
  pasosSel: string[] = [];

  constructor(
    private _teso18Service: Teso18Service,
    private _teso10Service: Teso10Service,
    private _teso20Service: Teso20Service,
    private _teso24Service: Teso24Service,
    private _gener02Service: Gener02Service,
    private cdr: ChangeDetectorRef
  ) {
    this.identity = this._gener02Service.getIdentity();
    this.notificacion = new Notificacion(0, '', '', '', '', '', this.identity.sub);
    this.allTeso20();
    this.getPagos();
    this.getNotificacion();
  }

  onSubmit(form: any) {
    if (form.invalid || this.pagosSel.length === 0 || this.pasosSel.length === 0) {
      form.control?.markAllAsTouched?.();
      Swal.fire('Faltan datos', 'Selecciona al menos un Pago y un Paso y corrige los campos obligatorios.', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Está seguro de guardar los datos?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed) {
        Swal.fire('Registro no guardado', '', 'info');
        return;
      }

      // construir combinaciones Pago x Paso
      const peticiones = [];
      for (const p of this.pagosSel) {
        for (const s of this.pasosSel) {
          const payload = {
            ...this.notificacion,
            pago: (p || '').toString().trim(),
            paso: (s || '').toString().trim()
          };
          peticiones.push(this._teso24Service.register(payload));
        }
      }

      if (peticiones.length === 0) {
        Swal.fire('Sin combinaciones', 'No hay pagos/pasos seleccionados', 'warning');
        return;
      }

      forkJoin(peticiones).subscribe({
        next: (responses: any[]) => {
          const ok = responses.filter(r => r?.status === 'success').length;
          const fail = responses.length - ok;

          if (ok > 0) {
            Swal.fire(
              'Registro(s) exitoso(s)',
              `Exitosos: ${ok} • Fallidos: ${fail}`,
              ok === responses.length ? 'success' : 'warning'
            );
            this.getNotificacion();
            this.resetFormulario();
          } else {
            Swal.fire('Error', 'No se pudo guardar ninguna combinación', 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error al guardar', error?.error?.message || 'Intenta de nuevo', 'error');
        }
      });
    });
  }

  editar(dt: any) {
    this.bandera_actualizar = true;
    this.notificacion.id = dt.id;
    this.notificacion.nombre = dt.detalle_usuario;
    this.notificacion.correo = dt.correo;

    const pago = (dt.pago || '').toString().replace(/\s+/g, '');
    const paso = (dt.paso || '').toString().replace(/\s+/g, '');
    this.pagosSel = pago ? [pago] : [];
    this.pasosSel = paso ? [paso] : [];

    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  eliminar(dt: any) {
    Swal.fire({
      title: '¿Está seguro de eliminar los datos?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed) {
        Swal.fire('Registro no eliminado', '', 'info');
        return;
      }

      this._teso24Service.delete(dt).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            Swal.fire('Eliminación exitosa', '', 'success');
            this.getNotificacion();
          } else {
            Swal.fire('Error al eliminar, verificar datos', '', 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error al eliminar, verificar datos', error?.error?.message || '', 'error');
        }
      });
    });
  }

  editar_data() {
    // Para editar, exactamente 1 pago y 1 paso
    if (this.pagosSel.length !== 1 || this.pasosSel.length !== 1) {
      Swal.fire('Selección inválida', 'Para editar, selecciona exactamente un Pago y un Paso', 'warning');
      return;
    }

    const payload = {
      ...this.notificacion,
      pago: (this.pagosSel[0] || '').toString().trim(),
      paso: (this.pasosSel[0] || '').toString().trim()
    };

    Swal.fire({
      title: '¿Está seguro de editar los datos?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed) {
        Swal.fire('Registro no editado', '', 'info');
        return;
      }

      this._teso24Service.update(payload).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            Swal.fire('Actualización exitosa', '', 'success');
            this.getNotificacion();
            this.bandera_actualizar = false;
            this.resetFormulario();
          } else {
            Swal.fire('Error al editar, verificar datos', '', 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error al editar', error?.error?.message || 'Intenta de nuevo', 'error');
        }
      });
    });
  }

  getPagos() {
    this._teso10Service.getPagos({}).subscribe(
      (response: any) => {
        this.pagos = response.data;
      }
    );
  }

  getNotificacion() {
    this._teso24Service.getNotificacion({}).subscribe(
      (response: any) => {
        this.data_notificacion = response;
      }
    );
  }

  agregar(dt: any) {
    this.notificacion.usuario = dt.usuario;
    this.notificacion.nombre = dt.nombre;
    this.usuarios = [];
  }

  input(event: any) {
    const keyword = event.target.value;
    if (keyword.length > 0) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this._teso18Service.getUsers(keyword).then((response: any) => {
          this.usuarios = response;
        });
      }, 500);
    } else {
      this.usuarios = [];
    }
  }

  allTeso20() {
    this._teso20Service.getAll({}).subscribe({
      next: (response: any) => {
        this.data_teso20 = response;
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }

  private resetFormulario() {
    this.notificacion = new Notificacion(0, '', '', '', '', '', this.identity.sub);
    this.pagosSel = [];
    this.pasosSel = [];
  }
}

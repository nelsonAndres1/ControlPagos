import { Component } from '@angular/core';
import { Teso18Service } from '../services/teso18.service';
import { Notificacion } from '../models/notificacion';
import { Teso10Service } from '../services/teso10.service';
import { Teso20Service } from '../services/teso20.service';
import { Teso24Service } from '../services/teso24.service';
import { Gener02Service } from '../services/gener02.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';


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

  constructor(private _teso18Service: Teso18Service,
    private _teso10Service: Teso10Service,
    private _teso20Service: Teso20Service,
    private _teso24Service: Teso24Service,
    private _gener02Service: Gener02Service,
    private cdr: ChangeDetectorRef) {

    this.identity = this._gener02Service.getIdentity();
    this.notificacion = new Notificacion(0, '', '', '', '', '', this.identity.sub);
    this.allTeso20();
    this.getPagos();
    this.getNotificacion();

  }
  onSubmit(form) {
    Swal.fire({
      title: "Esta seguro de guardar los datos?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this._teso24Service.register(this.notificacion).subscribe(
          response => {
            console.log(response);
            if (response.status == 'success') {
              Swal.fire('Registro exitoso', '', 'success');
              this.getNotificacion();
            } else {
              Swal.fire("Error al guardar, verificar datos", '', 'error');
            }
          }, error => {
            Swal.fire("Error al guardar, verificar datos: " + error.error.message, '', 'error');
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Registro no guardado!", '', 'info');
      }
    });
  }

  editar(dt) {
    this.bandera_actualizar = true;
    this.notificacion.id = dt.id;
    this.notificacion.nombre = dt.detalle_usuario;
    this.notificacion.correo = dt.correo;
    this.notificacion.pago = dt.pago.replace(/\s+/g, '');
    this.notificacion.paso = dt.paso.replace(/\s+/g, '');
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }


  eliminar(dt) {
    Swal.fire({
      title: "Esta seguro de eliminar los datos?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this._teso24Service.delete(dt).subscribe(
          response => {
            console.log(response);
            if (response.status == 'success') {
              Swal.fire('Eliminación exitosa', '', 'success');
              this.getNotificacion();
            } else {
              Swal.fire("Error al eliminar, verificar datos", '', 'error');
            }
          }, error => {
            Swal.fire("Error al eliminar, verificar datos: " + error.error.message, '', 'error');
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Registro no eliminado!", '', 'info');
      }
    });
  }

  editar_data() {

    Swal.fire({
      title: "Esta seguro de editar los datos?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this._teso24Service.update(this.notificacion).subscribe(
          response => {
            console.log(response);
            if (response.status == 'success') {
              Swal.fire('Actualización exitosa', '', 'success');
              this.getNotificacion();
              this.bandera_actualizar = false;
              this.notificacion = new Notificacion(0, '', '', '', '', '', this.identity.sub);
            } else {
              Swal.fire("Error al editar, verificar datos", '', 'error');
            }
          }, error => {
            Swal.fire("Error al editar, verificar datos: " + error.error.message, '', 'error');
          }
        )
      } else {
        Swal.fire("Registro no editado!", '', 'info');
      }
    });

  }

  getPagos() {
    this._teso10Service.getPagos({}).subscribe(
      response => {
        console.log("resss!!!")
        console.log(response)
        this.pagos = response.data;
      }
    )
  }


  getNotificacion() {
    this._teso24Service.getNotificacion({}).subscribe(
      response => {
        this.data_notificacion = response
        console.log(this.data_notificacion)
      }
    )
  }


  agregar(dt) {
    this.notificacion.usuario = dt.usuario
    this.notificacion.nombre = dt.nombre
    this.usuarios = []
  }


  input(event: any) {

    const keyword = event.target.value;
    if (keyword.length > 0) {
      clearTimeout(this.debounceTimer); // Limpiar el temporizador anterior
      this.debounceTimer = setTimeout(() => {
        this._teso18Service.getUsers(keyword).then(response => {
          this.usuarios = response;
          console.log(this.usuarios);
        });
      }, 500); // Esperar 500 ms después de que el usuario deje de escribir
    } else {
      this.usuarios = [];
    }
  }



  allTeso20() {
    this._teso20Service.getAll({}).subscribe(
      response => {
        this.data_teso20 = response;
        console.log(this.data_teso20);
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }
}

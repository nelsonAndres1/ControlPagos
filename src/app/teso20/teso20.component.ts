import { Component } from '@angular/core';
import { Teso20 } from '../models/teso20';
import { Gener02Service } from '../services/gener02.service';
import { Teso20Service } from '../services/teso20.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso20',
  templateUrl: './teso20.component.html',
  styleUrls: ['./teso20.component.css'],
  providers: [Gener02Service, Teso20Service]
})
export class Teso20Component {

  teso20: Teso20;                 // para CREAR
  teso20Edit: any = null;         // para EDITAR (objeto con id, proceso, detalle, usuario)
  modoEdicion: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  identity: any;
  data_teso20: any = [];

  constructor(
    private _Gener02Service: Gener02Service,
    private _Teso20Service: Teso20Service
  ) {
    this.identity = this._Gener02Service.getIdentity();

    // OJO: asegúrate que tu modelo Teso20 tenga detalle, si no, igual Angular lo agrega dinámicamente.
    this.teso20 = new Teso20('', '', '', '');
    this.teso20.usuario = this.identity.sub;
    (this.teso20 as any).detalle = ''; // por si el modelo no lo trae

    this.allTeso20();
  }

  get totalPages(): number {
    const total = (this.data_teso20?.length || 0);
    return total === 0 ? 1 : Math.ceil(total / this.pageSize);
  }

  addProceso(event: Event) {
    const input = event.target as HTMLInputElement;
    this.teso20.proceso = input.value;
  }

  addDetalle(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    (this.teso20 as any).detalle = input.value;
  }

  allTeso20() {
    this._Teso20Service.getAll({}).subscribe(response => {
      this.data_teso20 = response;
      // si estabas editando y recargas, mejor cancelar edición
      // (opcional) this.cancelarEdicion();
    });
  }

  guardar() {
    // validación mínima en front (sin tocar PHP)
    if (!this.teso20.proceso || !this.teso20.proceso.trim()) {
      Swal.fire("Falta Proceso", "Debes ingresar el proceso.", "warning");
      return;
    }
    if (!(this.teso20 as any).detalle || !(this.teso20 as any).detalle.trim()) {
      Swal.fire("Falta Detalle", "Debes ingresar el detalle.", "warning");
      return;
    }

    Swal.fire({
      icon: "question",
      title: "¿Está seguro de crear este proceso?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        // aseguro usuario siempre
        this.teso20.usuario = this.identity.sub;

        this._Teso20Service.save(this.teso20).subscribe(response => {
          if (response.status == 'success') {
            Swal.fire("Guardado!", "", "success").then(() => {
              // limpiar form
              this.teso20.proceso = '';
              (this.teso20 as any).detalle = '';
              this.allTeso20();
            });
          } else {
            Swal.fire("No guardado!", "", "error").then(() => this.allTeso20());
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados!", "", "info");
      }
    });
  }

  eliminar(dt: any) {
    Swal.fire({
      icon: "question",
      title: "¿Está seguro de ELIMINAR este proceso?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this._Teso20Service.delete(dt).subscribe(response => {
          if (response.status == 'success') {
            Swal.fire("Eliminado!", "", "success").then(() => this.allTeso20());
          } else {
            Swal.fire("No eliminado!", "", "error").then(() => this.allTeso20());
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Cambios no eliminados!", "", "info");
      }
    });
  }

  // ====== NUEVO: EDICIÓN ======

  editar(dt: any) {
    this.modoEdicion = true;

    // Clon para no modificar la tabla mientras escribes
    this.teso20Edit = {
      id: dt.id,
      proceso: dt.proceso ?? '',
      detalle: dt.detalle ?? '',
      usuario: this.identity.sub // tu PHP lo exige en update
    };
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.teso20Edit = null;
  }

  actualizar() {
    if (!this.teso20Edit) return;

    if (!this.teso20Edit.proceso || !this.teso20Edit.proceso.trim()) {
      Swal.fire("Falta Proceso", "Debes ingresar el proceso.", "warning");
      return;
    }
    if (!this.teso20Edit.detalle || !this.teso20Edit.detalle.trim()) {
      Swal.fire("Falta Detalle", "Debes ingresar el detalle.", "warning");
      return;
    }

    Swal.fire({
      icon: "question",
      title: "¿Está seguro de ACTUALIZAR este proceso?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        // mandamos exactamente lo que tu PHP update espera: id, usuario, proceso, detalle
        this._Teso20Service.update(this.teso20Edit).subscribe(response => {
          if (response.status == 'success') {
            Swal.fire("Actualizado!", "", "success").then(() => {
              this.cancelarEdicion();
              this.allTeso20();
            });
          } else {
            Swal.fire("No actualizado!", "", "error");
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Cambios no actualizados!", "", "info");
      }
    });
  }
}

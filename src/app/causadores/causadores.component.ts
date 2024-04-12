import { Component } from '@angular/core';
import { Teso18Service } from '../services/teso18.service';
import Swal from 'sweetalert2';
import { Estado } from '../models/estado';
@Component({
  selector: 'app-causadores',
  templateUrl: './causadores.component.html',
  styleUrls: ['./causadores.component.css'],
  providers: [Teso18Service]
})
export class CausadoresComponent {
  usuarios: any = [];
  usuarios_teso18: any = [];
  estado_data: Estado;
  constructor(private _teso18Service: Teso18Service) {
    this.estado_data = new Estado('', '');
    this.traerDatos();
  }


  traerDatos() {
    this._teso18Service.getTeso18({}).subscribe(
      response => {
        this.usuarios_teso18 = response;
        console.log("response!!!");
        console.log(response)
      }
    )
  }
  input(event) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      this.usuarios = []
    } else {
      const search = this._teso18Service.getUsers(keyword).then(response => {
        this.usuarios = response;
        console.log(this.usuarios);
      });
    }
  }

  agregar(dt) {

    Swal.fire({
      title: '¿Esta seguro de agregar a ' + dt.nombre + ' como causador?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {

        this._teso18Service.saveTeso18(dt).subscribe(
          response => {
            if (response.status != 'error') {
              if (response.status == 'info') {
                Swal.fire('Causador ya agregado!', '', 'info')
              } else {
                Swal.fire('Causador agregado!', '', 'success')
              }
            } else {
              Swal.fire('Causador No Agregado!', '', 'error')
            }
          }, error => {
            Swal.fire('Causador No Agregado!', '', 'error')
          }
        )
      } else if (result.isDenied) {
        Swal.fire('Causador No Agregado!', '', 'info')
      }
    })
  }

  estado(dt, estado) {

    Swal.fire({
      title: '¿Esta seguro de inactivar a ' + dt.nombre_docemp + ' ?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.estado_data.id = dt.id;
        this.estado_data.estado = estado;
        this._teso18Service.estadoTeso18(this.estado_data).subscribe(
          response => {
            Swal.fire('Cambio de estado realizado!', '', 'success');
            this.traerDatos();
          }, error => {
            Swal.fire('Cambio de estado NO realizado!', '', 'error');
          }
        )
      } else {
        Swal.fire('Cambio de estado NO realizado!', '', 'info');
      }
    });
  }

  eliminar(dt: any) {
    this._teso18Service.deleteTeso18(dt).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire('Información', response.message, response.status).then(() => {
            this.traerDatos()
          });
        } else {
          Swal.fire('Información', response.message, response.status).then(() => {
            this.traerDatos()
          });
        }
      }, error => {
        Swal.fire('Información', "Error desconocido!", 'error').then(() => {
          this.traerDatos()
        });
      }
    )
  }

}

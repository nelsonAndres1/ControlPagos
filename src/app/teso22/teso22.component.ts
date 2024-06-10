import { Component } from '@angular/core';
import { Teso22Service } from '../services/teso22.service';
import { Teso10Service } from '../services/teso10.service';
import { Gener02Service } from '../services/gener02.service';
import { Teso22 } from '../models/teso22';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso22',
  templateUrl: './teso22.component.html',
  styleUrls: ['./teso22.component.css'],
  providers: [Teso22Component, Teso10Service, Gener02Service]
})
export class Teso22Component {

  teso21_list: any;
  pagos_list: any;
  select_teso21: any
  select_pagos: any
  teso22: Teso22;
  identity: any;
  lista_datos: any;

  constructor(private _teso22Service: Teso22Service, private _teso10Service: Teso10Service, private _gener02Service: Gener02Service) {

    this.identity = this._gener02Service.getIdentity();
    this.getAllPagos();
    this.getDistinctTeso21();
    this.teso22 = new Teso22('', '', '', '');
    this.teso22.usuario = this.identity.sub;
    this.getAllTeso22();

  }

  getAllTeso22() {
    this._teso22Service.getTeso22All({}).subscribe(
      response => {
        console.log("res<!")
        console.log(response);
        this.lista_datos = response;
      }
    )
  }

  getAllPagos() {
    this._teso10Service.signup({}, true).subscribe(
      response => {
        console.log("res!");
        console.log(response)
        this.pagos_list = response;
      }
    )
  }

  getDistinctTeso21() {
    this._teso22Service.getDistinctTeso21({}).subscribe(
      response => {
        this.teso21_list = response;
      }
    )
  }

  tes21(event) {
    console.log(event.target.value)
    this.select_teso21 = event.target.value;
  }

  pagos(event) {
    console.log(event.target.value)
    this.select_pagos = event.target.value;
  }

  eliminar(dt){
    Swal.fire({
      title: "¿Esta seguro de eliminar estos datos?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "SI",
      denyButtonText: `NO`
    }).then((result) => {
      if (result.isConfirmed) {
        this._teso22Service.eliminar(dt).subscribe(
          response => {
            if (response.status == 'success') {
              Swal.fire("Datos eliminados!", "", "success").then(() => {
                window.location.reload()
              });
            } else {
              Swal.fire("Datos No eliminados!", "", "error");
            }
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Datos No eliminados!", "", "info");
      }
    });
  }

  guardar() {

    Swal.fire({
      title: "¿Esta seguro de guardar estos datos?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "SI",
      denyButtonText: `NO`
    }).then((result) => {
      if (result.isConfirmed) {
        this.teso22.pago_id = this.select_pagos;
        this.teso22.teso21_id = this.select_teso21;

        this._teso22Service.save(this.teso22).subscribe(
          response => {
            if (response.status == 'success') {
              Swal.fire("Cambios guardados!", "", "success").then(() => {
                window.location.reload()
              });
            } else {
              Swal.fire("Cambios No guardados!", "", "error");
            }
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Cambios No guardados!", "", "info");
      }
    });
  }

}

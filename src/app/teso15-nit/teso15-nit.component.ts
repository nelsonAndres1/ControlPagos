import { Component } from '@angular/core';
import { Teso15Service } from '../services/teso15.service';
import { Teso15Nit } from '../models/teso15Nit';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso15-nit',
  templateUrl: './teso15-nit.component.html',
  styleUrls: ['./teso15-nit.component.css'],
  providers: [Teso15Service]
})
export class Teso15NitComponent {

  teso15: Teso15Nit;
  teso15All = [];
  selectedRow: number | null = null;
  datos_:any;

  constructor(private _teso15Service: Teso15Service) {
    this.teso15 = new Teso15Nit('', '', '');
  }

  llenarNit(nit) {
    this.teso15.nit = nit.target.value;
  }

  consultar(index: number, dt) {
    console.log(dt)

    if (this.selectedRow === index) {
      this.selectedRow = null; // Deselecciona la fila si se hace clic nuevamente
    } else {
      this.selectedRow = index;
    }

    this.getAllEstadosPagos(dt);
  }

  getAllPagosForNit() {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait a moment',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this._teso15Service.getAllPagosForNit(this.teso15).subscribe(
      response => {
        this.teso15All = response;


        Swal.close();
      },
      error => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    );
  }


  getAllEstadosPagos(dt) {
    this.teso15.codclas = dt.codclas;
    this.teso15.numero = dt.numero;

    this._teso15Service.getAllEstadosPagos(this.teso15).subscribe(
      response =>{
        console.log(response)
        this.datos_ = response;
      }
    )

  }


}

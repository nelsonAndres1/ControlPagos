import { Component, OnInit } from '@angular/core';
import { teso25 } from '../models/teso25';
import { Teso25Service } from '../services/teso25.service';
import { Gener02Service } from '../services/gener02.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pasos-generales',
  templateUrl: './pasos-generales.component.html',
  styleUrls: ['./pasos-generales.component.css'],
  providers: [Teso25Service, Gener02Service]
})
export class PasosGeneralesComponent implements OnInit {

  teso25: teso25;
  identity: any;

  constructor(private _teso25Service: Teso25Service, private _gener02Service: Gener02Service) {

    this.identity = this._gener02Service.getIdentity();
    this.teso25 = new teso25(0,'',this.identity.sub);
    this.getDatos();

    console.log(this.teso25);

  }

  ngOnInit(): void {

  }

  

  addProceso(event:any) {

    console.log(event.target.value);
    this.teso25.paso = event.target.value;

  }


  guardar() {

    console.log(this.teso25)

    Swal.fire({
      title: "Desea guardar sus datos?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this._teso25Service.register(this.teso25).subscribe(
          response => {
            if (response.status = 'success') {
              Swal.fire("Datos guardados", "", "success");
            } else {
              Swal.fire("Error al guardar", "", "error");
            }
          },
          error => {
            Swal.fire("Error al guardar: " + error, "", "error");
            console.log(<any>error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire("No se guardaron los datos", "", "info");
      }
    });

  }

  getDatos() {
    this._teso25Service.getNotificacion(this.teso25).subscribe(
      response => {
        if (response.status = 'success') {
          this.teso25 = response.teso25;
        } else {
          Swal.fire("Error al obtener datos", "", "error");
        }
      },
      error => {
        Swal.fire("Error al obtener datos: " + error, "", "error");
        console.log(<any>error);
      }
    );

  }

}

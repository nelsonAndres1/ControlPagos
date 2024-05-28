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

  teso20: Teso20;
  identity: any;
  data_teso20: any = [];

  constructor(private _Gener02Service: Gener02Service, private _Teso20Service: Teso20Service) {
    this.identity = this._Gener02Service.getIdentity();
    this.teso20 = new Teso20('', '', '');
    this.teso20.usuario = this.identity.sub;
    this.allTeso20();

  }

  addProceso(event) {
    this.teso20.proceso = event.target.value;
  }


  allTeso20() {
    this._Teso20Service.getAll({}).subscribe(
      response => {
        console.log("response!!!!");
        console.log(response);
        this.data_teso20 = response;
      }
    )
  }

  guardar() {

    Swal.fire({
      icon: "question",
      title: "¿Esta seguro de crear este proceso?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this._Teso20Service.save(this.teso20).subscribe(
          response => {
            if (response.status == 'success') {
              Swal.fire("Cambios guardados!", "", "success").then(() => {
                this.allTeso20();
              });
            } else {
              Swal.fire("Cambios No guardados!", "", "error").then(() => {
                this.allTeso20();
              });
            }
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados!", "", "info");
      }
    });

  }


  eliminar(dt) {
    Swal.fire({
      icon: "question",
      title: "¿Esta seguro de ELIMINAR este proceso?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this._Teso20Service.delete(dt).subscribe(
          response => {
            if (response.status == 'success') {
              Swal.fire("Cambios eliminados!", "", "success").then(() => {
                this.allTeso20();
              });
            } else {
              Swal.fire("Cambios No eliminados!", "", "error").then(() => {
                this.allTeso20();
              });
            }
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Cambios no eliminados!", "", "info");
      }
    });
  }

}

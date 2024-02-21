import { Component } from '@angular/core';
import { Teso18Service } from '../services/teso18.service';
import { Teso19Service } from '../services/teso19.service';
import { Gener02Service } from '../services/gener02.service';
import { Teso19 } from '../models/teso19';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-revisores-autorizacion',
  templateUrl: './revisores-autorizacion.component.html',
  styleUrls: ['./revisores-autorizacion.component.css'],
  providers: [Teso18Service, Teso19Service, Gener02Service]
})
export class RevisoresAutorizacionComponent {

  identity: any;
  usuarios: any = [];
  teso19: Teso19;

  constructor(private _teso18Service: Teso18Service, private _teso19Service: Teso19Service, private _gener02Service: Gener02Service) {

    this.identity = this._gener02Service.getIdentity();
    this.teso19 = new Teso19('', '', '', '', '');
    this.teso19.usuario = this.identity.sub;

  }


  input(event) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      this.usuarios = []
    } else {
      const search = this._teso18Service.searchNomin02(keyword).then(response => {
        this.usuarios = response;
        console.log(this.usuarios);
      });
    }
  }

  async agregar(dt: any) {
    this.teso19.docemp = dt.docemp;
    const { value: fruit } = await Swal.fire({
      title: "Seleccione una opción",
      input: "select",
      inputOptions: {
        Opciones: {
          REVISA: "REVISA",
          AUTORIZA: "AUTORIZA"
        }
      },
      inputPlaceholder: "Seleccione una opción",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise(async (resolve) => {
          // Validación de la entrada
          if (value === "REVISA" || value === "AUTORIZA") {
            this.teso19.opcion = value;
            resolve(void 0); // Resolvemos la promesa con void
          } else {
            resolve('Seleccione una opción válida'); // Resolvemos la promesa con un argumento (mensaje de error)
          }
        });
      }
    });
    const { value: email } = await Swal.fire({
      title: "Ingrese cargo",
      input: "text",
      inputLabel: "Cargo",
      inputPlaceholder: "Ingrese el cargo"
    });
    if (email) {
      this.teso19.cargo = email;
    }
    if (fruit) {
      Swal.fire({
        title: `¿Esta seguro de guardar esta opcion: ${fruit}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`
      }).then((result) => {
        if (result.isConfirmed) {

          this._teso19Service.save(this.teso19).subscribe(
            response => {
              Swal.fire('Información', response.message, response.status).then(() => {
                window.location.reload();
              })
            }
          )
        } else if (result.isDenied) {
          Swal.fire("Cambio no realizado!", "", "info");
        }
      });
    }

  }
}

import { Component } from '@angular/core';
import { Teso13Service } from '../services/teso13.service';
import { Gener02Service } from '../services/gener02.service';
import { Editarteso13 } from '../models/editarteso13';
import { Router } from '@angular/router';
import { Teso13 } from '../models/teso13';
import { NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso13editar',
  templateUrl: './teso13editar.component.html',
  styleUrls: ['./teso13editar.component.css'],
  providers: [Teso13Service, Gener02Service]
})
export class Teso13editarComponent {

  public editarteso13: Editarteso13;
  public identity: any;
  public data_teso13: any = [];
  vacio: any = null;
  data: any = [];
  datacodcen: any = [];
  datac2: any;
  receivedData: any;
  teso13: Teso13;
  centroCostos = false;
  codcen_nombre: any;
  coddep_nombre: any;
  bandera: any;
  data_keyword: any = { data: '', codcen: '' }
  datac28: any;
  bandera28: any;
  bandera_formulario = false;
  periodos = [];
  bandera2: any
  nit_nombre: any;

  constructor(private router: Router, private _teso13Service: Teso13Service, private _gener02Service: Gener02Service) {
    this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', '', "", null, '', '', '0', '', '');
    this.identity = this._gener02Service.getIdentity();
    this.editarteso13 = new Editarteso13('', '', '', '', '', '', '', '', '', '', '', '', '', this.identity.sub, this.identity.sub);
    this.editarteso13.usuario = this.identity.sub;
    this.periodosT(2022, 2024);
    this._teso13Service.getTeso13Editar(this.editarteso13).subscribe(
      response => {
        this.data_teso13 = response;
      }
    )

  }

  touch(resultC: any) {
    console.log(resultC.nit);
    this.teso13.nit = resultC.nit;
    this.bandera2 = 'false';
    this.nit_nombre = resultC.razsoc;

  }

  periodosT(añoI: any, añoF: any) {
    var resultado;
    var años = [];
    if (añoI < añoF) {
      resultado = añoF - añoI;
      for (let index = 0; index < resultado; index++) {
        añoI = añoI + 1;
        años.push(añoI);
      }
      for (let index = 0; index < años.length; index++) {
        for (let i = 1; i < 13; i++) {
          if (i < 10) {
            this.periodos.push(años[index] + '0' + i)

          } else {
            this.periodos.push(años[index] + '' + i);

          }
        }
      }
    } else {
      console.log("No se puede con un año menor");
    }

  }

  getTeso13(event) {
    this.bandera_formulario = false;
    this.data = [];
    const keyword: any = {};
    keyword.keyword = event.target.value;
    keyword.usuario = this.identity.sub;

    console.log("key!")
    console.log(keyword)

    const search = this._teso13Service.searchTeso13(keyword).subscribe(response => {
      this.data = response;

      console.log(this.data);

    });
  }

  getPago(dt) {
    console.log("hola")
    this.data = [];
    this.teso13 = dt;
    this.vacio = dt.codclas + dt.numero;
    this.bandera_formulario = true;
  }


  onSubmit(form) {
    this.teso13.usuela = this.identity.sub;

    console.log("data!!!!")
    console.log(this.teso13);

    this._teso13Service.teso13update(this.teso13).subscribe(
      response => {
        Swal.fire('Información', response.message, response.status).then(() => {
          form.reset()
        });
      }
    )
  }

  getConta04(pclave: any) {
    const keyword = pclave.target.value;
    const search = this._teso13Service.getConta04(keyword).then(response => {
      this.datac2 = response;
    });
    this.bandera2 = 'true';
  }

  centroC() {

    console.log("atuda!")
    console.log(this.receivedData)


    if (this.centroCostos == true) {
      this.teso13.codcen = ''
      this.codcen_nombre = '';
      this.centroCostos = false;
      this.teso13.coddep = '';
      this.coddep_nombre = '';
    } else {
      this.teso13.codcen = '0000'
      this.codcen_nombre = 'VARIOS';
      this.centroCostos = true;
      this.teso13.coddep = '000000';
      this.coddep_nombre = 'VARIOS';
    }
  }

  getConta(pclave: any) {
    const keyword = pclave.target.value;
    const search = this._teso13Service.getConta06(keyword).then(response => {
      this.datacodcen = response;
    });
    this.bandera = 'true';
  }

  getDetailPage(result: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        result: JSON.stringify(result)
      }
    }
  }

  touchCC(result: any) {
    console.log(result.codcen);
    this.teso13.codcen = result.codcen;
    this.bandera = 'false';
    this.codcen_nombre = result.detalle;
  }


  getConta28(pclave: any) {

    this.data_keyword.data = pclave.target.value;
    this.data_keyword.codcen = this.teso13.codcen;
    const search = this._teso13Service.getConta28(this.data_keyword).subscribe(response => {
      this.datac28 = response;
      this.datac28;
    });
    this.bandera28 = 'true';
  }

  getDetailPageC28(resultC2: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        resultC2: JSON.stringify(resultC2)
      }
    }
  }

  touch28(result: any) {
    this.teso13.coddep = result.coddep;
    this.bandera28 = 'false';
    this.coddep_nombre = result.detalle;
  }


}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Teso15Service } from '../services/teso15.service';
import { Gener02 } from '../models/gener02';
import { identity } from 'rxjs';
import { Teso13Service } from '../services/teso13.service';
import { Teso14Service } from '../services/teso14.service';
import { Teso113 } from '../models/teso113';

@Component({
  selector: 'app-teso16',
  templateUrl: './teso16.component.html',
  styleUrls: ['./teso16.component.css'],
  providers: [Teso15Service, Teso13Service, Teso14Service]
})
export class Teso16Component implements OnInit {

  itemDetail: any = [];
  item1: any = [];
  item2: any = [];
  public status: any;
  public token: any;
  public identity: any;
  public identity1: any;
  public identity12: any;
  public soportes_subidos: any = [];
  v: any = true;
  public arrayN = Array();
  public data: any = '';

  constructor(private route: ActivatedRoute, private _teso15Service: Teso15Service, private _route: Router, private _teso13Service: Teso13Service, private _teso14Service: Teso14Service) {

    this.route.queryParams.subscribe(response => {
      const paramsData = JSON.parse(response['res2']);
      this.itemDetail = paramsData;
      this.item1 = this.itemDetail[0];
      this.item2 = this.itemDetail[1][0];

      for (let index = 0; index < this.item1.length; index++) {
        this.item1[index]['usuario'];
        this.getUsuario(this.item1[index]['usuario']);
        this.arrayN;
      }
      this.data = this.getAllTeso13(this.item1[0]['codclas'], this.item1[0]['numero']);
    })

  }
  getAllTeso13(codclas: any, numero: any) {
    this._teso15Service.getAllTeso13(new Teso113(codclas, numero)).subscribe(response => {
      this.data = response;
      console.log('jjjj');
      console.log(this.data);
    });
    return this.data;
  }

  ngOnInit(): void { }

  cambioEstadoNombre(estado: any) {
    var estadoEscr

    if (estado == 'RV') {
      estadoEscr = 'Revisión';
    }
    if (estado == 'RA') {
      estadoEscr = 'Radicado';
    }
    if (estado == 'AN') {
      estadoEscr = 'Anulado';
    }
    if (estado == 'AU') {
      estadoEscr = 'Autorizado';
    }
    if (estado == 'FI') {
      estadoEscr = 'Financiera';
    }
    if (estado == 'CT') {
      estadoEscr = 'Causación de Cuenta';
    }
    if (estado == 'PC') {
      estadoEscr = 'Causación Pago';
    }
    if (estado == 'DR') {
      estadoEscr = 'Devuelto Radicado';
    }
    if (estado == 'RT') {
      estadoEscr = 'Autorización Pago';
    }
    if (estado == 'DC') {
      estadoEscr = 'Devuelto Causación';
    }
    if (estado == 'PB') {
      estadoEscr = 'Pago Banco';
    }
    if (estado == 'PP') {
      estadoEscr = 'Pago Portal';
    }
    if (estado == 'RP') {
      estadoEscr = 'Preparación Transferencia';
    }
    if (estado == 'LC') {
      estadoEscr = 'Legalización de Cheque';
    }
    if (estado == 'CF') {
      estadoEscr = 'Cheque en Firmas';
    }
    if (estado == 'CE') {
      estadoEscr = 'Cheque Entregado';
    }
    if (estado == 'VF') {
      estadoEscr = 'Verificación Estado de Transferencia';
    }
    if (estado == 'PE') {
      estadoEscr = 'Pago Exitoso';
    }
    if (estado == 'CA') {
      estadoEscr = 'Causación de Pago';
    }
    if (estado == 'RC') {
      estadoEscr = 'Radicado Causación de Cuenta';
    }
    if (estado == 'CP') {
      estadoEscr = 'Radicado Causación Pago';
    }

    return estadoEscr;
  }

  downloadFile(array: any) {
    console.log(array.archivo)
    const fileName = "prueba.pdf";
    this._teso13Service.downloadFile(array.archivo).subscribe(
      response => {
        this.managePdfFile(response, fileName);
      }, error => {
      }
    )
  }
  managePdfFile(response: any, fileName: string): void {
    const datatype = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(new Blob(binaryData, { type: datatype }));
    const downloadLike = document.createElement('a');
    downloadLike.href = filtePath;
    downloadLike.setAttribute('download', fileName);
    document.body.appendChild(downloadLike);
    downloadLike.click();
  }


  nombreUsuario(user: any) {

    for (let index = 0; index < this.arrayN.length; index++) {
      if (this.arrayN[index] == user) {
        this.arrayN[index];
        this.arrayN[index + 1];
        Swal.fire(
          'Usuario encontrado',
          this.arrayN[index + 1],
          'info'
        )
        break;
      } else {

      }
    }
  }


  getUsuario(user: any) {

    this._teso15Service.getUsuario(new Gener02(user, '')).subscribe(
      response => {
        if (response.status != 'error') {
          this.status != 'success';
          this.token = response;

          this._teso15Service.getUsuario(new Gener02(user, ''), this.v).subscribe(
            response => {

              this.identity = response;
              this.identity;
              this.identity1 = this.identity[0]['nombre'];
              this.identity12 = this.identity[0]['usuario'];
              this.identity[0]['nombre'];
              this.identity[0]['usuario'];

              this.arrayN.push(this.identity[0]['usuario'], this.identity[0]['nombre']);
            },
            error => {
              this.status = 'error';
            }
          );

        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      });
  }

}

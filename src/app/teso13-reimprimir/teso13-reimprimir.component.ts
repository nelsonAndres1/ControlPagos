import { Component } from '@angular/core';
import { Teso13Service } from '../services/teso13.service';
import { Gener02Service } from '../services/gener02.service';
import { Impresion } from '../models/impresion';
import { Teso15Service } from '../services/teso15.service';
import { Teso113 } from '../models/teso113';
import { teso10 } from '../models/teso10';
import { PdfService } from '../services/pdf.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-teso13-reimprimir',
  templateUrl: './teso13-reimprimir.component.html',
  styleUrls: ['./teso13-reimprimir.component.css'],
  providers: [Teso13Service, Gener02Service, Teso15Service, PdfService, UtilidadesService]
})
export class Teso13ReimprimirComponent {

  identity: any;
  data: any = [];
  vacio: any = null;
  impreseion: Impresion;
  fecrad: any;
  identity1: any;
  array_fecrad: any = [];
  soportes: any;
  longitud: any = '';
  teso10: teso10

  constructor(private _PdfService: PdfService, private _teso15Service: Teso15Service, private _teso13Service: Teso13Service, private _gener02Service: Gener02Service, private _utilidadesService: UtilidadesService) {
    this.identity = this._gener02Service.getIdentity();
    this.impreseion = new Impresion('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
  }

  getTeso13(event) {

    this.data = [];
    const keyword: any = {};
    keyword.keyword = event.target.value;
    keyword.usuario = this.identity.sub;
    const search = this._teso13Service.searchTeso13(keyword).subscribe(response => {
      this.data = response;

      console.log(this.data);

    });
  }


  getPago(dt) {
    console.log("agagagagagag")
    console.log(dt.fecrad);
    this._teso15Service.getAllTeso13(new Teso113(dt.codclas, dt.numero)).subscribe(
      response => {
        if (response.status != 'error') {
          const { dia, mes, año } = this.extraerFecha(new Date(dt.fecrad));
          this.impreseion.dia = dia + '';
          this.impreseion.mes = mes + '';
          this.impreseion.ano = año + '';
          this.impreseion.numero_factura = dt.numfac;
          this.impreseion.nit_persona = dt.nit;
          this.impreseion.nombre_persona = '';
          this.impreseion.subdireccion = '';
          this.impreseion.dependencia = dt.coddep;
          this.impreseion.centro_costo = dt.codcen;
          this.impreseion.clase_pago = dt.codclas;
          this.impreseion.nombre_elaborado = dt.usuela;
          this.impreseion.nombre_autoriza = dt.peraut;
          this.impreseion.nombre_revisa = dt.perrev;
          this.impreseion.codigo_barras = dt.codclas + dt.numero;
          this.impreseion.coddep = dt.coddep;
          this.impreseion.fecha = dt.fecrad;
          this.impreseion.cdp = 'CDP: ' + dt.cdp_marca + dt.cdp_documento + dt.cdp_ano;
          this.impreseion.valor = 'VALOR: ' + dt.valor;
          this.impreseion.documento_clase = '';
          this.impreseion.numcon = dt.numcon;


          this._utilidadesService.getAllConta04(this.impreseion).subscribe(
            response => {
              this.impreseion.nombre_persona = response.detalle_razsoc;
              this.impreseion.centro_costo = response.detalle_codcen;
              this.impreseion.dependencia = dt.coddep + ' - ' + response.detalle_dependencia;
              this.impreseion.clase_pago = response.detalle_pago;
              this.impreseion.documento_clase = response.soportes;
              this.impreseion.nombre_elaborado = response.detalle_gener02;
              this.impreseion.numcon = dt.numcon;
              this._PdfService.generarPDF(this.impreseion).subscribe(
                response => {
                  const blob = new Blob([response], { type: 'application/pdf' });
                  const url = window.URL.createObjectURL(blob);
                  window.open(url);
                }
              )
            }
          )
        }
      }
    );
  }


  traerSoportes() {
    this.longitud = '';

    this._teso13Service.getSoportes(this.teso10).subscribe(
      response => {
        console.log("Ahhh Soportes");
        console.log(response);
        this.impreseion.documento_clase = response;
        this.soportes = response;
        for (let index = 0; index < this.soportes.length; index++) {
          this.longitud += this.soportes[index] + ',  ';
        }
        this.impreseion.documento_clase = this.longitud;
      }
    )
  }


  extraerFecha(fecha: Date): { dia: number, mes: number, año: number } {
    const dia = fecha.getDate() + 1;
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    return { dia, mes, año };
  }


  descargarPDF() {
    this._PdfService.generarPDF(this.impreseion).subscribe(
      response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    )
  }

}

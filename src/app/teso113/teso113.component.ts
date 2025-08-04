import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Router, ActivatedRoute } from '@angular/router';
import { Teso113 } from '../models/teso113';
import { teso10 } from '../models/teso10';
import { Teso15Service } from '../services/teso15.service';
import { Teso13Service } from '../services/teso13.service';
import { Gener02 } from '../models/gener02';
import Swal from 'sweetalert2';
import { PdfService } from '../services/pdf.service';
import { Impresion } from '../models/impresion';
import { firstValueFrom } from 'rxjs';


@Component({ selector: 'app-teso113', templateUrl: './teso113.component.html', styleUrls: ['./teso113.component.css'], providers: [Teso15Service, Teso13Service, PdfService] })
export class Teso113Component implements OnInit {

    @ViewChild('myData') myData: ElementRef;

    itemDetail: any = [];
    numero: any;
    codclas: any;
    data: any;
    identity: any;
    identity1: any;
    respuesta: any;
    nit: any;
    cc: any;
    depe: any;
    detalle: any;
    detalle2: any;
    cdp_marca: any;
    cdp_documento: any;
    cdp_ano: any;
    fecrad: any;
    soportes: any;
    teso10: teso10;
    array_fecrad: any = [];
    longitud: any = '';
    impreseion: Impresion;
    nombre_soportes_pago: any = '';

    constructor(private route: ActivatedRoute, private _router: Router, private _teso15Service: Teso15Service, private _teso13Service: Teso13Service, private _PdfService: PdfService) {

        this.impreseion = new Impresion('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
        this.teso10 = new teso10('', '', '', '', '', '');
        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
            this.numero = this.itemDetail[0];
            this.codclas = this.itemDetail[1];
            this.nit = this.itemDetail[2];
            this.cc = this.itemDetail[3];
            this.depe = this.itemDetail[4];
            this.cdp_marca = this.itemDetail[5];
            this.cdp_documento = this.itemDetail[6];
            this.cdp_ano = this.itemDetail[7];
            this.getTeso10(this.codclas);
            this.teso10.codclas = this.codclas;
            this.teso10.numero = this.numero;

            this.funcionPagos();
        });
    }



    async funcionPagos() {
        var soportes_pago: any;


        this._teso13Service.getSoportesForPago(new Teso113(this.codclas, this.numero)).subscribe(
            response => {
                console.log("Soportes for pago");
                console.log(response);
                soportes_pago = response;
                for (let index = 0; index < soportes_pago.length; index++) {
                    if (this.nombre_soportes_pago !== '') {
                        this.nombre_soportes_pago += ', ';
                    }
                    this.nombre_soportes_pago += soportes_pago[index].detalle_codsop;
                }
                console.log("Soportes for pago");
                console.log(this.nombre_soportes_pago);
            }
        )


        this._teso15Service.getAllTeso13(new Teso113(this.codclas, this.numero)).subscribe(response => {

            console.log('responseTeso13');
            console.log(response);

            if (response.status != 'error') {
                this.data = response;
                this.fecrad = this.data.fecrad;
                this.array_fecrad = this.fecrad.split('-');
                this.data['usuela'];
                this._teso15Service.getUsuario(new Gener02(this.data['usuela'], '')).subscribe(response => {

                    this.identity = response;
                    this.identity1 = this.identity[0]['nombre'];
                    let timerInterval;
                    this.traerSoportes();
                    const { dia, mes, año } = this.extraerFecha(new Date(this.data.fecrad));

                    this.impreseion.dia = dia + '';
                    this.impreseion.mes = mes + '';
                    this.impreseion.ano = año + '';
                    this.impreseion.numero_factura = this.data.numfac;
                    this.impreseion.nombre_persona = this.nit;
                    this.impreseion.nit_persona = this.data.nit;
                    this.impreseion.subdireccion = '' //falta
                    this.impreseion.dependencia = this.data.coddep + ' ' + this.depe;
                    this.impreseion.centro_costo = this.data.codcen + ' ' + this.cc;
                    this.impreseion.clase_pago = this.data.codclas + ' ' + this.detalle;

                    this.impreseion.nombre_elaborado = this.identity1;
                    this.impreseion.nombre_autoriza = this.data.peraut;
                    this.impreseion.nombre_revisa = this.data.perrev;
                    this.impreseion.codigo_barras = this.data.codclas + this.data.numero;
                    this.impreseion.coddep = this.data.coddep;
                    this.impreseion.fecha = this.data.fecrad;
                    this.impreseion.numcon = this.data.numcon;
                    this.impreseion.numfol = this.data.numfol;
                    this.impreseion.usucau = this.data.usucau;
                    this.impreseion.detalle = this.data.detalle;

                    if (this.cdp_documento == '00') {
                        this.impreseion.cdp = '-'
                    } else {
                        this.impreseion.cdp = this.cdp_marca + '-' + this.cdp_documento + '-' + this.cdp_ano;
                    }
                    this.impreseion.valor = this.data.valor;


                    Swal.fire({
                        title: 'Generando PDF...',
                        html: 'El proceso terminara en <b></b> milisegundos.',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                                b.textContent = Swal.getTimerLeft() + ''
                            }, 100)
                        },
                        willClose: () => {
                            this.descargarPDF();
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {

                        }
                    })
                })
            } else {

            }
        });
    }

    extraerFecha(fecha: Date): { dia: number, mes: number, año: number } {
        const dia = fecha.getDate() + 1;
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();

        return { dia, mes, año };
    }

    setPdf() {
        setTimeout(() => {
            const data = this.myData.nativeElement;
            const doc = new jsPDF('p', 'pt', 'a4');
            html2canvas(data).then(canvas => {
                const imgWidth = 600;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const contentDataURL = canvas.toDataURL('image/png');
                doc.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
                doc.save('reporte_pago.pdf');
                doc.output('dataurlnewwindow');
            })
        }, 500);
        this._router.navigate['/principal'];
    }
    getTeso10(n: any) {
        this._teso13Service.name_teso10(new teso10(n, '', '', '', '', '')).subscribe(
            response => {
                this.detalle = response.detclas;
                console.log(this.detalle);
            },
            error => {
                this.detalle = 'error';
                console.log(<any>error);
            });
    }

    traerSoportes() {
        this.longitud = '';
        this._teso13Service.getSoportes(this.teso10).subscribe(
            response => {
                this.impreseion.documento_clase = this.nombre_soportes_pago;
                this.soportes = response;
                for (let index = 0; index < this.soportes.length; index++) {
                    this.longitud += this.soportes[index] + ',  ';
                }
                this.impreseion.documento_clase = this.nombre_soportes_pago;
            }
        )
    }


    ngOnInit(): void { }

    async descargarPDF() {
        console.log("ayudaaaaaaaaa!!!!!!!!!!!!!!!!!!!!")
        console.log(this.codclas);
        console.log(this.numero);

        if (this.numero.toString().length < 7) {
            this.numero = this.numero.toString().padStart(7, '0');
        } else {
            this.numero = this.numero.toString();
        }

        // ✅ Reiniciar variable para evitar duplicados
        this.nombre_soportes_pago = '';

        try {
            const soportes_pago: any = await firstValueFrom(
                this._teso13Service.getSoportesForPago(new Teso113(this.codclas, this.numero))
            );

            console.log("Soportes for pago");
            console.log(soportes_pago);

            for (let index = 0; index < soportes_pago.length; index++) {
                if (this.nombre_soportes_pago !== '') {
                    this.nombre_soportes_pago += ', ';
                }
                this.nombre_soportes_pago += soportes_pago[index].detalle_codsop;
            }

            this.impreseion.documento_clase = this.nombre_soportes_pago;

            const pdfBlob: any = await firstValueFrom(
                this._PdfService.generarPDF(this.impreseion)
            );

            const blob = new Blob([pdfBlob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);

        } catch (error) {
            console.error('Error al generar PDF:', error);
        }
    }



}

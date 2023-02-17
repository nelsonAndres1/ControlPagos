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
import { identity } from 'rxjs';
import { teso12 } from '../models/teso12';

@Component({ selector: 'app-teso113', templateUrl: './teso113.component.html', styleUrls: ['./teso113.component.css'], providers: [Teso15Service, Teso13Service] })
export class Teso113Component implements OnInit {

    @ViewChild('myData') myData: ElementRef;

    itemDetail: any = [];
    numero: any;
    codclas: any;
    public data: any;
    public identity: any;
    public identity1: any;
    public respuesta: any;
    public nit: any;
    public cc: any;
    public depe: any;
    public detalle: any;
    public detalle2: any;
    public cdp_marca: any;
    public cdp_documento: any;
    public cdp_ano: any;
    public fecrad: any;
    public soportes: any;
    public teso10: teso10;
    public array_fecrad: any = [];
    constructor(private route: ActivatedRoute, private _router: Router, private _teso15Service: Teso15Service, private _teso13Service: Teso13Service) {

        this.teso10 = new teso10('', '', '', '');
        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
            console.log("Itemdetal!!!!!")
            console.log(this.itemDetail);
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

            console.log("sdoashdoiauhio");
            console.log(this.nit, this.cc, this.depe);
            console.log("Teso13---");
            console.log(new Teso113(this.codclas, this.numero))
            this._teso15Service.getAllTeso13(new Teso113(this.codclas, this.numero)).subscribe(response => {

                if (response.status != 'error') {
                    this.data = response;
                    console.log("response!!!!!");
                    console.log(this.data);
                    this.fecrad = this.data.fecrad;
                    this.array_fecrad = this.fecrad.split('-');
                    console.log(this.array_fecrad);
                    this.data['usuela'];

                    this._teso15Service.getUsuario(new Gener02(this.data['usuela'], '')).subscribe(response => {
                        console.log(response);
                        this.identity = response;
                        this.identity1 = this.identity[0]['nombre'];
                        let timerInterval;


                        this.traerSoportes();

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
                                this.setPdf();


                                clearInterval(timerInterval)
                            }
                        }).then((result) => { /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {

                            }
                        })
                    })
                }else{

                    console.log(response);


                }


            });
        });
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
        this._teso13Service.name_teso10(new teso10(n, '', '', '')).subscribe(
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
        this._teso13Service.getSoportes(this.teso10).subscribe(
            response => {
                console.log("Ahhh Soportes");
                console.log(response);
                this.soportes = response;
            }
        )
    }


    ngOnInit(): void { }

}

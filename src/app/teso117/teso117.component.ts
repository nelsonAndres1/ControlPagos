import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Teso15Service } from '../services/teso15.service';
import { Teso117Service } from '../services/teso117.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Gener02 } from '../models/gener02';
import { Teso113 } from '../models/teso113';
import { Teso13Teso15 } from '../models/teso13teso15';
import { global } from '../services/global';
import { Teso12Service } from '../services/teso12.service';
import { Documento } from '../models/documento';
import { Conta04 } from '../models/conta04';
@Component({
    selector: 'app-teso117',
    templateUrl: './teso117.component.html',
    styleUrls: ['./teso117.component.scss'],
    providers: [Teso15Service, Teso117Service, Teso12Service]
})

export class Teso117Component implements OnInit { /* RA - Radicado
    RV -Revisado
    Au-Autorizado
    FI-Financiera
    CT-Causacion
    CP-Causado Punto
    DR-Devuelto Radicado
    DC-Devuelto Causacion
    PC-Causacion Pago
    RT-Revisado Tesoreria
    RP-Radicacion Pago
    PP-Pago Portal
    PB-Pago Banco
    AN-Anulado 
    LC-Legalización de Cheque
    CF-Cheque en Firmas
    CE-Cheque Entregado
    VF-Aprobación de transferencia
    PE-Pago Exitoso
    CA-Causación de Pago
    */

    public array1 = ['Revisión', 'Anulado'];
    public array2 = ['Autorizado', 'Anulado'];
    public array3 = ['Financiera', 'Anulado'];
    public array4 = ['Causación de Cuenta', 'Causación de Pago', 'Anulado'];
    public array5 = ['Causación Pago', 'Devuelto Radicado', 'Anulado'];
    public array6 = ['Autorización Pago', 'Devuelto Causación', 'Devuelto Radicado', 'Anulado'];
    public array7 = ['Preparación Transferencia', 'Legalización de Cheque', 'Devuelto Causación', 'Anulado'];
    public array8 = [
        'Aprobación de transferencia',
        'Devuelto Causación',
        'Anulado'
    ];
    public array9 = [
        'Cheque en Firmas',
        'Devuelto Causación',
        'Devuelto Radicado',
        'Anulado'
    ];
    public array10 = [
        'Cheque Entregado',
        'Devuelto Causación',
        'Devuelto Radicado',
        'Anulado'
    ];
    public array11 = [
        'Pago Exitoso',
        'Devuelto Causación',
        'Anulado'
    ];


    public btn = false;
    public data: any = '';
    public arraySalida = [];
    itemDetail: any = [];
    item1: any = [];
    item2: any = [];
    public status: any;
    public token: any;
    public identity: any;
    public identity1: any;
    public identity12: any;
    v: any = true;
    public arrayN = Array();
    public estadoA: any;
    public estadoActual: any;
    public itemF: any;
    public teso13teso15: any;
    public permisos: any;
    public arrayPermisos: any;
    pdfSource = '0090000053136comprobante_de_pago.pdf';
    documento: Documento;
    soportes: any;
    global_url = global.url;
    banderasop: any = true;
    estadoEscrito: any = '';
    conta04: Conta04;
    observacion:string = '';


    constructor(private route: ActivatedRoute, private _teso15Service: Teso15Service, private _teso12Service: Teso12Service, private _teso117Service: Teso117Service, private _router: Router) {

        this.conta04 = new Conta04('', '');
        this.pdfSource = global.url + 'teso12/getDocumento/' + '009000004085Javeriana001.pdf'

        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['res2']);
            this.itemDetail = paramsData;

            this.item1 = this.itemDetail[0];
            console.log("item1!!!!");
            console.log(this.item1);
            this.data = this.getAllTeso13(this.item1[0]['codclas'], this.item1[0]['numero']);
            this.item2 = this.itemDetail[1][0];
            console.log("data!!!!");
            console.log(this.data);
            for (let index = 0; index < this.item1.length; index++) {

                this.getUsuario(this.item1[index]['usuario']);

                this.estadoA = this.item1[index]['estado'];

                this.itemF = this.item1[index];

            }
            console.log("estado!");
            console.log(this.estadoA);

            this.estados(this.estadoA);

        });

    }
    manageExcel(response: any, fileName: string): void {
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);

        const filePath = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
    getAllTeso13(codclas: any, numero: any) {
        this._teso15Service.getAllTeso13(new Teso113(codclas, numero)).subscribe(response => {
            this.data = response;
            console.log('jjjj');
            console.log(this.data);
            this.traerSoportes();
        });
        return this.data;
    }
    sop1() {
        this.banderasop = true;
        console.log(this.banderasop);
    }
    sop2() {
        this.banderasop = false;
        console.log(this.banderasop);
    }

    nombreUsuario(user: any) {
        console.log("Buscando..")
        for (let index = 0; index < this.arrayN.length; index++) {
            if (this.arrayN[index] == user) {
                console.log(this.arrayN[index]);
                console.log(this.arrayN[index + 1]);
                Swal.fire('Usuario encontrado', this.arrayN[index + 1], 'info')
                break;
            } else {
                console.log("No encontrado!");
            }
        }
    }
    getUsuario(user: any) {

        this._teso15Service.getUsuario(new Gener02(user, '')).subscribe(response => {
            if (response.status != 'error') {
                this.status != 'success';
                this.token = response;

                this._teso15Service.getUsuario(new Gener02(user, ''), this.v).subscribe(response => {

                    this.identity = response;
                    this.identity1 = this.identity[0]['nombre'];
                    this.identity12 = this.identity[0]['usuario'];

                    this.arrayN.push(this.identity[0]['usuario'], this.identity[0]['nombre']);

                }, error => {
                    this.status = 'error';
                    console.log(<any>error);
                });

            } else {
                this.status = 'error';
                console.log('errrorrr')
            }
        }, error => {
            this.status = 'error';
            console.log(<any>error);
        });
    }

    traerSoportes() {
        console.log("data!");
        console.log(this.data);
        this._teso117Service.traerSoportes(this.data).subscribe(
            response => {
                this.soportes = response;
                console.log("soportes!");
                console.log(this.soportes);
            }
        )
    }


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
            estadoEscr = 'Aprobación de transferencia';
        }
        if (estado == 'PE') {
            estadoEscr = 'Pago Exitoso';
        }
        if (estado == 'CA') {
            estadoEscr = 'Causación de Pago';
        }

        return estadoEscr;
    }
    cambioEstado(estado: any) {

        this.estadoActual = estado;
        if (estado == 'Revisión') {
            this.estadoActual = 'RV';
        }
        if (estado == 'Anulado') {
            this.estadoActual = 'AN';
        }
        if (estado == 'Autorizado') {
            this.estadoActual = 'AU';
        }
        if (estado == 'Financiera') {
            this.estadoActual = 'FI';
        }
        if (estado == 'Causación de Cuenta') {
            this.estadoActual = 'CT';
        }
        if (estado == 'Causación Pago') {
            this.estadoActual = 'PC';
        }
        if (estado == 'Devuelto Radicado') {
            this.estadoActual = 'DR';
        }
        if (estado == 'Autorización Pago') {
            this.estadoActual = 'RT';
        }
        if (estado == 'Devuelto Causación') {
            this.estadoActual = 'DC';
        }
        if (estado == 'Pago Banco') {
            this.estadoActual = 'PB';
        }
        if (estado == 'Pago Portal') {
            this.estadoActual = 'PP';
        }
        if (estado == 'Preparación Transferencia') {
            this.estadoActual = 'RP';
        }
        if (estado == 'Legalización de Cheque') {
            this.estadoActual = 'LC';
        }
        if (estado == 'Cheque en Firmas') {
            this.estadoActual = 'CF';
        }
        if (estado == 'Cheque Entregado') {
            this.estadoActual = 'CE';
        }
        if (estado == 'Aprobación de transferencia') {
            this.estadoActual = 'VF';
        }
        if (estado == 'Pago Exitoso') {
            this.estadoActual = 'PE';
        }
        if (estado == 'Causación de Pago') {
            this.estadoActual = 'CA';
        }
        console.log(this.estadoActual);
    }

    estados(estado: any) {
        var bandera: any;
        this.permisos = localStorage.getItem('permisos');

        if (this.permisos != null) {
            this.arrayPermisos = this.permisos.split(',');

            if (estado == 'RA' || estado == 'DR') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RV' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array1;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Revisar', 'error');
                }
            }
            if (estado == 'RV') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'AU' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array2;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Autorizar', 'error');
                }
            }
            if (estado == 'AU') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'FI' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array3;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Financiera', 'error');
                }
            }
            if (estado == 'FI') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'CT' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array4;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Causación', 'error');
                }
            }
            if (estado == 'CT' || estado == 'DC') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'PC' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array5;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Causación Pago', 'error');
                }
            }
            if (estado == 'PC' || estado == 'CA') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RT' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array6;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Revisión Tesoreria', 'error');
                }
            }
            if (estado == 'RT') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RP' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array7;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Revisión Pago', 'error');
                }
            }
            if (estado == 'RP') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'P' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array8;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Pago', 'error');
                }
            }

            if (estado == 'LC') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'LC' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array9;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Pago', 'error');
                }
            }

            if (estado == 'CF') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'CF' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array10;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Pago', 'error');
                }
            }

            if (estado == 'VF') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'VF' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array11;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Pago', 'error');
                }
            }


/*             if (estado == 'RT') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'CA' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array6;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Pago', 'error');
                }
            } */
        } else {
            Swal.fire('Error', 'Usted no tiene Permisos', 'error');
        }
    }

    evento(event){
        this.observacion = event.target.value;
    }


    submit() {
        var datoU = JSON.parse(localStorage.getItem('identity'));

        datoU['sub'];

        this.itemF['numfac']; // actual

        this.teso13teso15 = new Teso13Teso15(this.itemF['codclas'], this.itemF['numero'], this.itemF['numfac'], this.estadoActual, this.estadoA, datoU['sub'], '', '', this.observacion);
        Swal.fire({
            title: "¿Estas Seguro?",
            text: "Cambiaras de estado tu pago",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'
        }).then(result => {
            if (result.value) {
                if (this.estadoA == 'RA') {

                    this._teso117Service.updateTeso13RegisterTeso15(this.teso13teso15).subscribe(response => {
                        if (response.status == "success") {
                            this.status = response.status;

                        } else {
                            this.status = 'error'
                        }
                    }, error => {
                        this.status = 'error';
                        console.log(<any>error);
                    });

                    Swal.fire('Listo!', 'Estado de Pago actualizado Satisfactoriamente', 'success');
                    this._router.navigate(['teso17']);
                } else if (this.estadoA == 'RV') {

                    this._teso117Service.updateTeso13RegisterTeso15AU(new Teso13Teso15(this.itemF['codclas'], this.itemF['numero'], this.itemF['numfac'], this.estadoActual, this.estadoA, '', datoU['sub'], '', this.observacion)).subscribe(response => {
                        if (response.status == "success") {
                            this.status = response.status;

                        } else {
                            this.status = 'error'
                        }
                    }, error => {
                        this.status = 'error';
                        console.log(<any>error);
                    });

                    Swal.fire('Listo!', 'Estado de Pago actualizado Satisfactoriamente', 'success');
                    this._router.navigate(['teso17']);
                } else {


                    this._teso117Service.updateTeso13(new Teso13Teso15(this.itemF['codclas'], this.itemF['numero'], this.itemF['numfac'], this.estadoActual, this.estadoA, '', '', datoU['sub'], this.observacion)).subscribe(response => {
                        if (response.status == "success") {
                            this.status = response.status;

                        } else {
                            this.status = 'error'
                        }
                    }, error => {
                        this.status = 'error';
                        console.log(<any>error);
                    });

                    Swal.fire('Listo!', 'Estado de Pago actualizado Satisfactoriamente', 'success');
                    this._router.navigate(['teso17']);
                }
            } else {

                Swal.fire('Cancelado', 'Estado de pago No actualizado', 'error');
            }

        })
    }

    ngOnInit(): void { }
    getConta04(nit) {
        this.conta04.nit = nit;
        this._teso117Service.getConta04(this.conta04).subscribe(
            response => {
                Swal.fire(
                    'Razon Social:',
                    response.razsoc,
                    'info'
                )
            }
        )
    }

}

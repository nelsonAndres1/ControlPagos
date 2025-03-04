import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, NavigationExtras } from '@angular/router';
import { Teso13 } from '../models/teso13';
import { Teso13Service } from '../services/teso13.service';
import { Gener02Service } from '../services/gener02.service';
import { Teso10Service } from '../services/teso10.service';
import { Teso12Service } from '../services/teso12.service';
import jsPDF from 'jspdf';
import { Teso17 } from '../models/teso17';
import { Conta71 } from '../models/conta71';
import { UtilidadesService } from '../services/utilidades.service';
import { Teso19Service } from '../services/teso19.service';
import { Numfac } from '../models/numfac';
import { error } from 'console';

@Component({
    selector: 'app-teso13',
    templateUrl: './teso13.component.html',
    styleUrls: ['./teso13.component.css'],
    providers: [Teso13Service, Gener02Service, Teso10Service, Teso12Service, UtilidadesService, Teso19Service]
})
export class Teso13Component implements OnInit {

    bandera_loading = false;
    teso13: Teso13;
    status: any;
    token2: any;
    identity2: any;
    identity3: any;
    token: any;
    identity: any;
    v: any = true;
    res: any;
    consecutivo = '';
    nconsecutivo: number;
    usu: string;
    tpago: any;
    num: any; // consecutivo
    usuela: any; // usuario
    codclas: any; // codigo clase
    periodos = [];
    data: any;
    datac2: any;
    datac28: any;
    valor: any;
    bandera: any;
    bandera2: any;
    bandera28: any;
    nit_nombre: any;
    codcen_nombre: any;
    coddep_nombre: any;
    marca: any = ['AC', 'OP', 'SU'];
    data71: any;
    datos_teso17: any = [];
    cuota: any;
    cdp_marca: any;
    cdp_documento: any;
    cdp_ano: any;
    nit: any;
    bd1 = true;
    siCDPno = false;
    valor_CDP: any;
    valor_a: any;
    datoSoportes: any;
    fechaRdicado: any = '';
    centroCostos = false;
    cdp_bandera = false;
    personas_revisa = [];
    personas_autoriza = [];
    data_cant_pagos = '';
    data_keyword: any = { data: '', codcen: '' }
    numfac: Numfac;

    constructor(private _teso13Service: Teso13Service, private _gener02Service: Gener02Service, private _teso10Service: Teso10Service, private _teso12Service: Teso12Service, private _router: Router, private _utilidadesService: UtilidadesService, private _teso19Service: Teso19Service) {

        this.numfac = new Numfac('');
        this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', '', "", null, '', '', '0', '', '');
        this.periodosT(2024, 2025);
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.tpago = this._teso12Service.getTpago();
        this._teso13Service.fecha().subscribe(
            response => {
                this.fechaRdicado = response;
            }
        )
        this.nconsecutivo = 0;
        this.usu = '1';
        this.tpago = '1';
        this.traerConsecutivo();
        this.datoSoportes = JSON.parse(localStorage.getItem('identity1') + '');

        if (this.datoSoportes.length == 0) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No existen soportes asociados al tipo de pago!' });
            this._router.navigate(['teso10']);
        }

        this._utilidadesService.getAutorizaRevisa({ 'opcion': 'REVISA' }).subscribe(
            response => {
                this.personas_revisa = response;
                console.log("1");
                console.log(this.personas_revisa)
            }
        )

        this._utilidadesService.getAutorizaRevisa({ 'opcion': 'AUTORIZA' }).subscribe(
            response => {
                this.personas_autoriza = response;
                console.log("2");
                console.log(this.personas_autoriza)
            }
        )

    }
    touch(resultC: any) {

        this._teso19Service.getAllPagos(resultC).subscribe(
            response => {
                console.log("RESPONSE!!!!!  ");
                console.log(response)
                this.data_cant_pagos = 'Este Nit tiene esta cantidad de pagos: ' + response.total_pagos
            }
        )

        console.log(resultC.nit);
        this.teso13.nit = resultC.nit;
        this.bandera2 = 'false';
        this.nit_nombre = resultC.razsoc;

    }

    CDP() {
        if (this.cdp_bandera == true) {
            this.cdp_bandera = false;
        } else {
            this.cdp_bandera = true;
            this.teso13.cdp_marca = '';
            this.teso13.cdp_documento = '';
            this.teso13.cdp_ano = '';
        }
    }

    centroC() {
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

    touchCC(result: any) {
        console.log(result.codcen);
        this.teso13.codcen = result.codcen;
        this.bandera = 'false';
        this.codcen_nombre = result.detalle;
    }
    touch28(result: any) {
        this.teso13.coddep = result.coddep;
        this.bandera28 = 'false';
        this.coddep_nombre = result.detalle;
    }

    getConta(pclave: any) {
        this.bandera_loading = true; const keyword = pclave.target.value;
        const search = this._teso13Service.getConta06(keyword).then(
            response => {
                this.bandera_loading = false;
                this.data = response;
                this.data;
            }, error => {
                this.bandera_loading = false;
            });
        this.bandera = 'true';
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
    getConta04(pclave: any) {
        this.bandera_loading = true;
        const keyword = pclave.target.value;
        const search = this._teso13Service.getConta04(keyword).then(
            response => {
                this.bandera_loading = false;
                this.datac2 = response;
                this.datac2;

            }, error => {
                this.bandera_loading = false;
            }
        );
        this.bandera2 = 'true';
    }
    getDetailPage(result: any) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(result)
            }
        }
    }
    getDetailPageC2(resultC: any) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                resultC: JSON.stringify(resultC)
            }
        }
    }

    getDetailPageC28(resultC2: any) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                resultC2: JSON.stringify(resultC2)
            }
        }
    }

    getC71(marca: string, documento: any) {
        const keyword = [marca, documento];

        const search = this._teso13Service.getC71(keyword).then(response => {
            this.data71 = response;
            console.log(this.data71);
        });

    }
    getDetailPageC71(result: any) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(result)
            }
        }
    }

    ngOnInit(): void {
        this._teso13Service.test();
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


    buscarT17(cdp_marca: any, cdp_documento: string, cdp_ano: any, nit: any) {
        this._teso13Service.getbusqueda71(new Conta71(cdp_marca, cdp_documento, cdp_ano, nit)).subscribe(response => {

            if (response) {
                this.cdp_marca = cdp_marca;
                this.cdp_documento = cdp_documento;
                this.cdp_ano = cdp_ano;
                this.nit = nit;

                this._teso13Service.getTeso17(new Teso17(nit, cdp_marca, cdp_documento, cdp_ano, '', '', 0, 0, '')).subscribe(
                    response => {
                        this.siCDPno = true;
                        this.bd1 = true;
                        if (response.numcuo == response.cuota) {
                            if (response.numcuo == undefined) {
                                this.teso13.numcuo = 1;
                                this.cuota = 1;
                            } else {
                                Swal.fire('Información', 'Ya se han realizado la totalidad de los pagos', 'info');
                                this.teso13.numcuo = 1;
                                this.cuota = 1;
                            }
                        } else {
                            this.datos_teso17.push(response.numcuo, response.cuota);
                            this.teso13.numcuo = response.numcuo;
                            this.cuota = parseInt(response.cuota) + 1;
                        }
                    },
                    error => {
                        this.bd1 = false;
                    });
            } else {
                this.bd1 = false;
                Swal.fire('¡Error!', 'No existen datos asociados a CDP Y NIT!', 'error');
            }
        });
    }
    valorCDP(cdp_marca: any, cdp_documento: any, cdp_ano: any, nit: any) { }


    onSubmit(form: any) {

        Swal.fire({

            title: "¿Estas Seguro?",
            text: "Iniciaras un nuevo Pago",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'

        }).then(result => {

            this.teso13.fecrad = this.fechaRdicado;
            if ((this.teso13.numcon + '').trim() == '') {
                this.teso13.numcon = '0';
            }
            if (result.value) {

                if (this.siCDPno == true) {
                    this.teso13.sCDPn = true;
                    this._teso13Service.valorCDP(new Conta71(this.cdp_marca, this.cdp_documento, this.cdp_ano, this.nit)).subscribe(response => {

                        if (response >= parseInt(this.teso13.valor)) {

                            var arrayD = [];
                            arrayD.push(this.num, this.tpago, this.nit_nombre, this.codcen_nombre, this.coddep_nombre, this.cdp_marca, this.cdp_documento, this.cdp_ano, this.nit);

                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    result: JSON.stringify([this.teso13, arrayD])
                                }
                            }
                            this._router.navigate(['teso12_upload'], navigationExtras);
                            Swal.fire('Formulario diligenciado!', 'Pendiente envio!', 'success');

                        } else {
                            Swal.fire('Error!', 'Pago No Enviado, valor de CDP insuficiente', 'error');
                        }
                    });
                } else {

                    this.teso13.sCDPn = false;
                    var arrayD = [];
                    arrayD.push(this.num, this.tpago, this.nit_nombre, this.codcen_nombre, this.coddep_nombre, 'OP', '00', '0', this.teso13.nit);

                    this.teso13.cdp_ano = "0";
                    this.teso13.cdp_documento = '00';
                    this.teso13.cdp_marca = 'OP';

                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            result: JSON.stringify([this.teso13, arrayD])
                        }
                    }
                    this._router.navigate(['teso12_upload'], navigationExtras);
                    Swal.fire('Formulario diligenciado!', 'Pendiente envio!', 'success');

                }


            } else {
                Swal.fire('Cancelado!', 'Pago No Enviado', 'error');
            }
        })
    }
    download() {
        var img = new Image();
        img.src = '../../assets/logo.png';
        var doc = new jsPDF("p", "pt", "a4");
        doc.addImage(img, 40, 30, 100, 76);
        doc.setFontSize(22);
        doc.text('Reporte de Pago', 20, 20);
        doc.save('reporte_pago.pdf');
    }


    traerConsecutivo() {
        this.tpago = JSON.parse(localStorage.getItem("tpa") + '');
        this.tpago = this.tpago[0]['codclas'];
        this.codclas = this.tpago;
        this.teso13.codclas = this.codclas;
        this._teso13Service.traerConsecutivo(this.teso13).subscribe(response => {
            if (response.status != 'error') {
                this.token2 = response;
                /*                 this._teso13Service.traerConsecutivo(this.teso13).subscribe(response => { */
                this.identity2 = response;
                this.identity3 = response;
                this.consecutivo = this.identity2[0]['numero'];
                this.nconsecutivo = parseInt(this.consecutivo);
                this.nconsecutivo = this.nconsecutivo;
                this.num = this.nconsecutivo;
                this.teso13.numero = this.num;
                this.usu = this.identity['sub'];
                this.usuela = this.usu;
                this.teso13.usuela = this.usuela;

            } else {

                this.status = 'error';

            }
        }, error => {
            this.status = 'error';
            console.log(<any>error);
        });
    }
    verificarNumero(event) {
        this.bandera_loading = true;
        this.numfac.numfac = event.target.value;
        this._teso13Service.verificarNumero(this.numfac).subscribe(
            response => {
                this.bandera_loading = false;
                if (response.status == 'success') {
                    if (response.bandera == '1') {
                        Swal.fire('Información', 'Este numero de factura ya existe en un pago!');
                    } else {

                    }
                }

            }, error => {
                this.bandera_loading = false;
            }
        )
    }

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value;
      
        // Eliminar todos los puntos existentes para evitar duplicados
        value = value.replace(/\./g, '');
      
        // Permitir solo números y una coma como separador decimal
        value = value.replace(/[^0-9,]/g, '');
      
        // Separar parte entera y decimal
        const [integerPart, decimalPart] = value.split(',');
      
        // Formatear la parte entera con puntos de miles
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
        // Reconstruir el número completo en formato europeo
        input.value = decimalPart !== undefined ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
      
        // Actualizar el modelo
        this.teso13.valor = input.value;
      }
      
      
}

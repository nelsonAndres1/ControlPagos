import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {Teso15Service} from '../services/teso15.service';
import {Teso117Service} from '../services/teso117.service';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {Gener02} from '../models/gener02';
import {ThisReceiver} from '@angular/compiler';
import {Teso113} from '../models/teso113';
import {Teso13Teso15} from '../models/teso13teso15';
@Component({
    selector: 'app-teso117',
    templateUrl: './teso117.component.html',
    styleUrls: ['./teso117.component.css'],
    providers: [Teso15Service, Teso117Service]
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
    AN-Anulado */

    public array1 = ['Revisión', 'Anulado'];
    public array2 = ['Autorizado', 'Anulado'];
    public array3 = ['Financiera', 'Anulado'];
    public array4 = ['Causación', 'Anulado'];
    public array5 = ['Causación Pago', 'Devuelto Radicado', 'Anulado'];
    public array6 = ['Revision Tesoreria', 'Devuelto Causación', 'Devuelto Radicado', 'Anulado'];
    public array7 = ['Radicación Pago', 'Devuelto Causación', 'Devuelto Radicado', 'Anulado'];
    public array8 = [
        'Pago Banco',
        'Pago Portal',
        'Devuelto Causación',
        'Devuelto Radicado',
        'Anulado'
    ];

    public data : any = '';
    public arraySalida = [];
    itemDetail : any = [];
    item1 : any = [];
    item2 : any = [];
    public status : any;
    public token : any;
    public identity : any;
    public identity1 : any;
    public identity12 : any;
    v : any = true;
    public arrayN = Array();
    public estadoA : any;
    public estadoActual : any;
    public itemF : any;
    public teso13teso15 : any;
    public permisos : any;
    public arrayPermisos : any;


    constructor(private route : ActivatedRoute, private _teso15Service : Teso15Service, private _teso117Service : Teso117Service, private _router : Router) {


        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['res2']);
            this.itemDetail = paramsData;

            this.item1 = this.itemDetail[0];
            this.data = this.getAllTeso13(this.item1[0]['codclas'], this.item1[0]['numero']);
            this.item2 = this.itemDetail[1][0];
            for (let index = 0; index < this.item1.length; index++) {

                this.getUsuario(this.item1[index]['usuario']);

                this.estadoA = this.item1[index]['estado'];

                this.itemF = this.item1[index];

            }

            this.estados(this.estadoA);

        });

    }
    getAllTeso13(codclas : any, numero : any) {
        this._teso15Service.getAllTeso13(new Teso113(codclas, numero)).subscribe(response => {
            this.data = response;
            console.log('jjjj');
            console.log(this.data);
        });
        return this.data;


    }
    nombreUsuario(user : any) {
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
    getUsuario(user : any) {

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
                    console.log(< any > error);
                });

            } else {
                this.status = 'error';
                console.log('errrorrr')
            }
        }, error => {
            this.status = 'error';
            console.log(< any > error);
        });
    }

    cambioEstado(estado : any) {

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
        if (estado == 'Causación') {
            this.estadoActual = 'CT';
        }
        if (estado == 'Causación Pago') {
            this.estadoActual = 'PC';
        }
        if (estado == 'Devuelto Radicado') {
            this.estadoActual = 'DR';
        }
        if (estado == 'Revision Tesoreria') {
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
        if (estado == 'Radicación Pago') {
            this.estadoActual = 'RP';
        }
        console.log(this.estadoActual);
    }

    estados(estado : any) {
        var bandera: any;
        this.permisos = localStorage.getItem('permisos');

        if (this.permisos != null) {
            this.arrayPermisos = this.permisos.split(',');

            if (estado == 'RA' || estado == 'DR') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RV' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array1;
                        bandera = true;
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
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Causación Pago', 'error');
                }
            }
            if (estado == 'PC') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RT' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array6;
                        bandera = true;
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
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Pago', 'error');
                }
            }
        } else {
            Swal.fire('Error', 'Usted no tiene Permisos', 'error');
        }
    }
    submit() {
        var datoU = JSON.parse(localStorage.getItem('identity'));

        console.log(datoU['sub']);
        console.log("Boton");
        console.log(this.itemF['numfac']); // actual
        console.log(this.estadoA);
        console.log(this.estadoActual);
        this.teso13teso15 = new Teso13Teso15(this.itemF['codclas'], this.itemF['numero'], this.itemF['numfac'], this.estadoActual, this.estadoA, datoU['sub'], '', '');
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
                    console.log("entra1111");
                    this._teso117Service.updateTeso13RegisterTeso15(this.teso13teso15).subscribe(response => {
                        if (response.status == "success") {
                            this.status = response.status;

                        } else {
                            this.status = 'error'
                        }
                    }, error => {
                        this.status = 'error';
                        console.log(< any > error);
                    });
                    console.log('yes');
                    Swal.fire('Listo!', 'Estado de Pago actualizado Satisfactoriamente', 'success');
                    this._router.navigate(['teso17']);
                } else if (this.estadoA == 'RV') {
                    console.log("rev");
                    this._teso117Service.updateTeso13RegisterTeso15AU(new Teso13Teso15(this.itemF['codclas'], this.itemF['numero'], this.itemF['numfac'], this.estadoActual, this.estadoA, '', datoU['sub'], '')).subscribe(response => {
                        if (response.status == "success") {
                            this.status = response.status;

                        } else {
                            this.status = 'error'
                        }
                    }, error => {
                        this.status = 'error';
                        console.log(< any > error);
                    });
                    console.log('yes');
                    Swal.fire('Listo!', 'Estado de Pago actualizado Satisfactoriamente', 'success');
                    this._router.navigate(['teso17']);
                } else {

                    console.log("rev");
                    this._teso117Service.updateTeso13(new Teso13Teso15(this.itemF['codclas'], this.itemF['numero'], this.itemF['numfac'], this.estadoActual, this.estadoA, '', '', datoU['sub'])).subscribe(response => {
                        if (response.status == "success") {
                            this.status = response.status;

                        } else {
                            this.status = 'error'
                        }
                    }, error => {
                        this.status = 'error';
                        console.log(< any > error);
                    });
                    console.log('yes');
                    Swal.fire('Listo!', 'Estado de Pago actualizado Satisfactoriamente', 'success');
                    this._router.navigate(['teso17']);
                }
            } else {
                console.log('No!');
                Swal.fire('Cancelado', 'Estado de pago No actualizado', 'error');
            }

        })
    }

    ngOnInit(): void {}

}

import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { teso12 } from '../models/teso12';
import { Nombres } from '../models/nombres';
import { Teso12Service } from '../services/teso12.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { global } from '../services/global';
import { Teso13Service } from '../services/teso13.service';
import { Teso13 } from '../models/teso13';
import { modelUpdate } from '../models/modelUpdate';
import { Gener02Service } from '../services/gener02.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-teso12',
    templateUrl: './teso12.component.html',
    styleUrls: ['./teso12.component.css'],
    providers: [Teso12Service, Teso13Service]
})
export class Teso12Component implements OnInit {
    public previsualizacion: any;
    formGroup: UntypedFormGroup;
    itemDetail: any = [];
    public teso13: Teso13;
    public teso12: teso12;
    public status: any;
    public token: any;
    public identity: any;
    public v: any = true;
    public nombres: Nombres;
    public tpa: any;
    public datoSoportes: any;
    public archivos: any = [];
    public codclas: any;
    public numero: any;
    public codsop: any;
    public token2: any;
    public identity2: any;
    public identity3: any;
    public consecutivo: any;
    public nconsecutivo: number;
    public usu: string;
    public tpago: any;
    public iden: any;
    public iden1: any;
    public sele: any;
    public afuConfig: any;
    public index = 0;
    public original: string;
    public random: any;
    public original1: any;
    public longSop: any = 0;
    public permisos: any;
    public banderaPermisos: any = true;
    public contarPer: any = 0;
    public confirPer: any = 0;
    files: any;
    public estedato: any;
    public datos_actualizados: any;
    sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    constructor(public formulario: UntypedFormBuilder, private _teso12Service: Teso12Service, private _router: Router, private _route: ActivatedRoute, private sanitizer: DomSanitizer, private _userService: Teso13Service, private _gener02Service: Gener02Service) {

        this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 0, '', '', '', '', '', '', '', '', '', '', '', 4, 3, 2, '', '', '', '', null, '', '', '1', '', '','');
        this.nconsecutivo = 0;
        this.nombres = new Nombres('', 0, '');
        this.tpago = JSON.parse(localStorage.getItem("tpa") + '');
        this.tpago = this.tpago[this.index]['codclas'];
        this.nombres.codclas = this.tpago;
        this.teso13.codclas = this.tpago;
        this.traerConsecutivo();
        this.nombres.numpago = this.nconsecutivo;
        this.datoSoportes = JSON.parse(localStorage.getItem('identity1') + '');
        console.log("datosssssssssss!")
        console.log(this.datoSoportes);
        this.iden = this._gener02Service.getIdentity();

        this._route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
            this.datos_actualizados = this.itemDetail[0];
        });

        if (this.datoSoportes.length == 0) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No existen soportes asociados al tipo de pago!' });
            this._router.navigate(['teso113']);
        }

        this.permisos = this.datoSoportes[this.datoSoportes.length - 1]['obliga']; // agre

        for (let index = 0; index < this.permisos.length; index++) {
            this.datoSoportes[index]['per'] = this.permisos[index];
        }

        for (let index = 0; index < this.permisos.length; index++) {
            if (this.permisos[index] == 'S') {
                this.banderaPermisos = false;
                this.contarPer = this.contarPer + 1;
            }
        }

        this.teso12 = new teso12('', '');
        this.usu = '1';
        this.nombres = new Nombres('', 0, '');
        this.formGroup = this.formulario.group({ n1: [''], n2: [''] });
        this.teso13.bandera_actualizar = '1';
        console.log("ayuda!");
        console.log(this.teso13);
        this.teso13.codclas = this.datos_actualizados.codclas;
        this.teso13.numero = this.datos_actualizados.numero;
        console.log("aytuda!!!")
        console.log(this.teso13);
        this._userService.traerConsecutivo(this.teso13).subscribe(response => {
            if (response.status != 'error') {
                this.token2 = response;
                /*                 this._userService.traerConsecutivo(this.teso13).subscribe(response => { */
                this.identity2 = response;
                this.identity3 = response;
                this.consecutivo = this.identity2[this.index]['numero'];

                this.nconsecutivo = + this.teso13.numero;
                this.tpago;
                this.nconsecutivo;
                this.original1;

                this.afuConfig = {
                    multiple: false,
                    formatsAllowed: ".docx, .pdf",
                    maxSize: 50,
                    uploadAPI: {
                        url: global.url + 'teso12/upload?json={"codclas":"' + this.tpago + '","numpago":"' + this.nconsecutivo + '","tiposoporte":"' + this.random + '","estedato":"' + this.estedato + '"}',
                        headers: {
                            "Authorization": this._teso12Service.getToken()
                        }
                    },
                    theme: "attachPin",
                    hideProgressBar: true,
                    hideResetBtn: true,
                    hideSelectBtn: true,
                    replaceTexts: {
                        selectFileBtn: 'Select Files',
                        resetBtn: 'Reset',
                        uploadBtn: 'Upload',
                        dragNDropBox: 'Drag N Drop',
                        attachPinBtn: 'Seleccionar Soportes',
                        afterUploadMsg_success: 'Successfully Uploaded !',
                        afterUploadMsg_error: 'Upload Failed !'
                    }
                };
            } else {
                this.status = 'error';
            }
        }, error => {
            this.status = 'error';

        });
    }

    ngOnInit(): void {
        this.random = this.randomIntFromInterval(1, 999);
    }


    uploadImage(event) {
        this.files = event.target.files[0];
    }

    confirmacion(dt: any, dat: any) {
        var con = '';
        Swal.fire({
            title: '¿El soporte es Copia o Original?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Copia',
            denyButtonText: `Original`
        }).then((result) => {
            if (result.isConfirmed) {
                this.original = 'n';

                var model = new modelUpdate(this.tpago, parseInt(this.teso13.numero), this.random, dt.codsop, 'n', this.estedato);
                this._teso12Service.update(model).subscribe(response => {
                    if (response.status == 'success') {
                        this.status = response.status;
                        Swal.fire('El soporte se ha guardado como una Copia!', '', 'success');
                    } else {
                        this.status = 'error';
                        Swal.fire('El soporte NO se ha guardado!', '', 'error');
                    }
                }, error => {
                    Swal.fire('El soporte NO se ha guardado!', '', 'error');
                    this.status = 'error';
                });

                return con = this.original;
            } else {
                this.original = 's';
                this._teso12Service.update(new modelUpdate(this.tpago, parseInt(this.teso13.numero), this.random, dt.codsop, 's', this.estedato)).subscribe(response => {
                    if (response.status == 'success') {
                        this.status = response.status;
                        Swal.fire('El soporte se ha guardado como Original!', '', 'success');
                    } else {
                        this.status = 'error';
                        Swal.fire('El soporte NO se ha guardado!', '', 'error');
                    }
                }, error => {
                    Swal.fire('El soporte NO se ha guardado!', '', 'error');
                    this.status = 'error';
                });

                return con = this.original;
            }
        });
    }

    imagenes(datos: any, per: any) {
        this.longSop = this.longSop + 1;

        if (per == 'S') {
            this.confirPer = this.confirPer + 1;
        }
        if (this.confirPer == this.contarPer) {
            this.banderaPermisos = true;
        }

        let data_image = datos.body;
        this.datoSoportes.image = data_image;
        this.identity = data_image;
    }
    pasar() {

        this._route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
        });


        if (this.banderaPermisos) {
            this._userService.register(this.itemDetail[0]).subscribe(response => {

                if (response.status == "success") {
                    this.status = response.status;
                    var arrayD = this.itemDetail[1];

                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            result: JSON.stringify(arrayD)
                        }
                    }
                    this._router.navigate(['teso113'], navigationExtras);
                    Swal.fire('Listo!', 'Pago Enviado Existosamente!', 'success');

                } else {

                    Swal.fire('Listo!', response.error.message, 'success');

                    this.status = 'error';
                }
            }, error => {
                Swal.fire('Error!', error.error.message, 'info').then(() => {
                    this._router.navigate(['teso10']);
                });

            });
        }
    }

    permisoContinuar() { }

    soporteUpload(dat: any, per: any, datos: any, dt: any) {
        this.estedato = dat;
        this.tpago = JSON.parse(localStorage.getItem("tpa") + '');
        this.tpago = this.tpago[0]['codclas'];
        this.nombres.codclas = this.tpago;
        this.nombres.numpago = this.nconsecutivo;
        this.sele = dat;
        this.nombres.tiposoporte = this.sele;

        this._teso12Service.getNombre(this.nombres).subscribe(response => {
            if (response.status != 'error') {
                this.status = 'success';
                this.token = response;

                this._teso12Service.getNombre(this.nombres, this.v).subscribe(async response => {

                    this.iden1 = response;
                    this.identity = response;
                    this.imagenes(datos, per);
                    this.confirmacion(dt, dat);


                }, error => {
                    this.status = 'error1';
                    Swal.fire("Error", "No se pudo subir el documento", 'error');
                });

            } else {
                this.status = 'error';

            }

        }, error => {
            this.status = 'error2';

        });
    }


    randomIntFromInterval(min: number, max: number) { 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    traerConsecutivo() {
        var cs;

        this._userService.traerConsecutivo(this.teso13).subscribe(response => {
            if (response.status != 'error') {
                this.token2 = response;
                this._userService.traerConsecutivo(this.teso13).subscribe(response => {
                    this.identity2 = response;
                    this.identity3 = response;
                    this.consecutivo = this.identity2[0]['numero'];
                    this.nconsecutivo = + this.consecutivo;
                    cs = this.nconsecutivo;
                }, error => {
                    this.status = 'error';
                });
            } else {
                this.status = 'error';
            }
        }, error => {
            this.status = 'error';
        });
        return cs;
    }

    onNombres() {

        this._teso12Service.getNombre(this.nombres).subscribe(response => {
            if (response.status != 'error') {
                this.status = 'success';
                this.token = response;

                this._teso12Service.getNombre(this.nombres, this.v).subscribe(response => {
                    this.iden1 = response;
                    this.identity = response;

                }, error => {
                    this.status = 'error';

                });
            } else {
                this.status = 'error';

            }
        }, error => {
            this.status = 'error';

        });
    }

    checked($event) {
        const isChecked = $event.target.checked;
        if (isChecked == true) {
            this.original = 's';
        } else {
            this.original = 'n';
        }
        return this.original;
    }
}

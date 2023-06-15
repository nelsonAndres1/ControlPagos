import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
    formGroup: FormGroup;
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

    constructor(public formulario: FormBuilder, private _teso12Service: Teso12Service, private _router: Router, private _route: ActivatedRoute, private sanitizer: DomSanitizer, private _userService: Teso13Service, private _gener02Service: Gener02Service) {

        this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 0, '', '', '', '', '', '', '', '', '', '', '', 4, 3, 2, '', '', '', '', null, '', '');
        this.nconsecutivo = 0;

        this.nombres = new Nombres('', 0, '');

        this.tpago = JSON.parse(localStorage.getItem("tpa") + '');

        this.tpago = this.tpago[this.index]['codclas'];
        this.nombres.codclas = this.tpago;
        this.teso13.codclas = this.tpago;
        this.traerConsecutivo();
        this.nombres.numpago = this.nconsecutivo;
        this.datoSoportes = JSON.parse(localStorage.getItem('identity1') + '');

        this.iden = this._gener02Service.getIdentity();
        console.log("longitud");
        console.log(this.datoSoportes.length);

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

        console.log(this.datoSoportes);


        console.log(this.permisos);
        this.teso12 = new teso12('');

        this.usu = '1';
        this.nombres = new Nombres('', 0, '');
        this.formGroup = this.formulario.group({ n1: [''], n2: [''] });

        this._userService.traerConsecutivo(this.teso13).subscribe(response => {
            if (response.status != 'error') {
                this.token2 = response;
                this._userService.traerConsecutivo(this.teso13).subscribe(response => {
                    this.identity2 = response;
                    this.identity3 = response;
                    this.consecutivo = this.identity2[this.index]['numero'];
                    console.log("consecutivo1");
                    console.log(this.consecutivo);
                    this.nconsecutivo = + this.consecutivo;
                    this.nconsecutivo = this.nconsecutivo;
                    this.tpago;
                    this.nconsecutivo;
                    this.original1;

                    console.log("consecutivo2");
                    console.log(this.nconsecutivo);
                    // Inicio afuconfig
                    this.afuConfig = {
                        multiple: false,
                        formatsAllowed: ".docx, .pdf",
                        maxSize: 50,
                        uploadAPI: {
                            url: global.url + 'teso12/upload?json={"codclas":"' + this.tpago + '","numpago":"' + this.nconsecutivo + '","tiposoporte":"' + this.random + '"}',
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
                    // Fin afuconfig
                }, error => {
                    this.status = 'error';
                    console.log(<any>error);
                });
            } else {
                this.status = 'error';
            }
        }, error => {
            this.status = 'error';
            console.log(<any>error);
        });
    }

    ngOnInit(): void {
        this.random = this.randomIntFromInterval(1, 999);
    }


    uploadImage(event) {
        this.files = event.target.files[0];
        console.log("filesssss!");
        console.log(this.files);
    }

    confirmacion(dt: any) {

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
                this._teso12Service.update(new modelUpdate(this.tpago, this.nconsecutivo, this.random, dt.codsop, 'n')).subscribe(response => {
                    if (response.status == 'success') {
                        this.status = response.status;
                    } else {
                        this.status = 'error';
                    }
                }, error => {
                    this.status = 'error';
                    console.log(<any>error);
                });
                Swal.fire('El soporte se ha guardado como una Copia!', '', 'success');
                return con = this.original;
            } else {
                this.original = 's';
                this._teso12Service.update(new modelUpdate(this.tpago, this.nconsecutivo, this.random, dt.codsop, 's')).subscribe(response => {
                    if (response.status == 'success') {
                        this.status = response.status;
                    } else {
                        this.status = 'error';
                    }
                }, error => {
                    this.status = 'error';
                    console.log(<any>error);
                });
                Swal.fire('El soporte se ha guardado como Original!', '', 'success');
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

        console.log("longitud1111");
        console.log(this.longSop);
        let data_image = datos.body;
        this.datoSoportes.image = data_image;
        this.identity = data_image;

    }
    pasar() {

        this._route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
        });
        console.log("item detail");
        console.log(this.itemDetail[0]);

        if (this.banderaPermisos) {
            this._userService.register(this.itemDetail[0]).subscribe(response => {

                if (response.status == "success") {
                    this.status = response.status;
                    console.log("Status");
                    console.log(response);
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
                Swal.fire('Error!', error.error.message, 'info');

            });
        }
    }

    permisoContinuar() { }

    soporteUpload(dat: any, per: any, datos: any, dt: any) {


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

                this._teso12Service.getNombre(this.nombres, this.v).subscribe(response => {

                    this.iden1 = response;
                    this.identity = response;

                    // inicio subir imagen
                    this.imagenes(datos, per);

                    // Fin  subir imagen

                    this.confirmacion(dt);

                    console.log("Ahhhhh prueba de permiso");
                    console.log(dt);
                }, error => {
                    this.status = 'error1';
                    Swal.fire("Error", "No se pudo subir el documento", 'error');
                });

            } else {
                this.status = 'error';
                console.log("errorrrrrrrrr");
            }

        }, error => {
            this.status = 'error2';
            console.log(<any>error);
        });
    }


    randomIntFromInterval(min: number, max: number) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    traerConsecutivo() {
        var cs;
        console.log("aisha");
        console.log(this.teso13);

        this._userService.traerConsecutivo(this.teso13).subscribe(response => {
            if (response.status != 'error') {
                this.token2 = response;
                this._userService.traerConsecutivo(this.teso13).subscribe(response => {
                    this.identity2 = response;
                    this.identity3 = response;
                    this.consecutivo = this.identity2[0]['numero'];
                    this.nconsecutivo = + this.consecutivo;
                    this.nconsecutivo = this.nconsecutivo + 1;

                    cs = this.nconsecutivo;
                }, error => {
                    this.status = 'error';
                    console.log(<any>error);
                });
            } else {
                this.status = 'error';
            }
        }, error => {
            this.status = 'error';
            console.log(<any>error);
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
                    console.log(<any>error);
                });
            } else {
                this.status = 'error';
                console.log("erorrrrr");
            }
        }, error => {
            this.status = 'error';
            console.log(<any>error);
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

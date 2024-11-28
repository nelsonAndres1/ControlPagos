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
import { Teso13Service } from '../services/teso13.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'app-teso117',
    templateUrl: './teso117.component.html',
    styleUrls: ['./teso117.component.scss'],
    providers: [Teso15Service, Teso117Service, Teso12Service, Teso13Service, UploadService]
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
    selectedFiles: { [key: string]: File } = {}; // Objeto para almacenar archivos seleccionados
    datos_pago: any;
    texto: string = '';
    maxLength: number = 299;
    bandera_archivo = false;
    resultado_caracteres: any;

    public array1 = ['Revisión', 'Anulado'];
    public array2 = ['Autorizado', 'Anulado'];
    public array3 = ['Financiera', 'Anulado'];
    public array4 = ['Causación de Cuenta', 'Radicado Causación Pago', 'Anulado'];
    public array41 = ['Radicado Causación de Cuenta', 'Radicado Causación Pago', 'Anulado'];
    public array5 = ['Causación Pago', 'Devuelto Radicado', 'Anulado'];
    public array51 = ['Radicado Causación Pago', 'Devuelto Radicado', 'Anulado'];
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
    observacion: string = '';

    title: string = 'ng2-pdf-viewer';
    src: string = 'assets/pspdfkit-web-demo.pdf';
    errorMessage: string | null = null;
    uploading: boolean = false; // Bandera para indicar si se está subiendo archivos

    page: number = 1;
    totalPages: number = 0;
    isLoaded: boolean = false;
    nombre_archivo: any;


    constructor(private uploadService: UploadService,
        private route: ActivatedRoute,
        private _teso15Service: Teso15Service,
        private _teso117Service: Teso117Service,
        private _router: Router) {

        this.conta04 = new Conta04('', '');
        this.pdfSource = global.url + 'teso12/getDocumento/' + '009000004085Javeriana001.pdf'

        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['res2']);
            console.log("params data!!!")
            
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

    downloadPDF(so: any) {
        const url = this.global_url + 'teso12/getDocumento/' + so.archivo;
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'documento.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error al descargar el archivo:', error));
    }
    toggleFullScreen() {
        const pdfViewer = document.querySelector('pdf-viewer');
        const pdfContainer = pdfViewer.shadowRoot.querySelector('.pdfViewer');

        if (pdfContainer) { // Verifica si el contenedor del PDF existe
            if (pdfContainer.requestFullscreen) {
                if (!document.fullscreenElement) {
                    pdfContainer.requestFullscreen().then(() => {
                        console.log('PDF en pantalla completa');
                    }).catch((err) => {
                        console.error('Error al activar pantalla completa:', err);
                    });
                } else {
                    document.exitFullscreen().then(() => {
                        console.log('Saliendo de pantalla completa');
                    }).catch((err) => {
                        console.error('Error al salir de pantalla completa:', err);
                    });
                }
            }
        } else {
            console.error('El contenedor del PDF no se encontró');
        }
    }
    onFileSelected(event: any, filename: string, dt: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFiles[filename] = file;
        }
        console.log(dt);
        console.log(filename);
        this.datos_pago = dt;

    }

    uploadFiles() {

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


                if (this.bandera_archivo) {
                    let data = new Teso113(this.datos_pago.codclas, this.datos_pago.numero);

                    if (this.estadoActual == 'PC') {
                        this.data.codtipag = '178';
                    } else if (this.estadoActual == 'PE') {
                        this.data.codtipag = '179';
                    } else if (this.estadoActual == 'CT') {
                        this.data.codtipag = '177';
                    }

                    const formData = new FormData();
                    Object.values(this.selectedFiles).forEach(file => {
                        formData.append('files[]', file);
                        formData.append('data[]', JSON.stringify(this.data));
                    });

                    this.uploadService.uploadArchivos(formData)
                        .subscribe(
                            response => {
                                this.uploading = false;
                                if (response.success) {
                                    Swal.fire('info', 'Archivos subidos exitosamente:' + response.files, 'info').then(() => {
                                        this.submit();
                                    })
                                } else {
                                    this.errorMessage = response.message;
                                    Swal.fire('Error!', 'Error al subir archivos:' + this.errorMessage, 'error');
                                }
                            }, error => {
                                this.uploading = false;
                                Swal.fire('Error!', 'Error al subir archivos: ' + error.error.message, 'error').then(() => {
                                    this.errorMessage = 'Error al subir archivos. Por favor, inténtalo de nuevo.';
                                    Swal.fire('error!', this.errorMessage, 'error');
                                });
                            }
                        )
                } else {
                    this.submit();
                }
            } else {
                Swal.fire('error!', 'Datos no enviados!', 'error');
            }
        })
    }


    afterLoadComplete(pdfData: any) {
        this.totalPages = pdfData.numPages;
        this.isLoaded = true;
    }

    nextPage() {
        this.page++;
    }

    prevPage() {
        this.page--;
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
    }
    sop2() {
        this.banderasop = false;
    }

    nombreUsuario(user: any) {
        console.log(this.item1)
        console.log("Buscando..")
        for (let index = 0; index < this.arrayN.length; index++) {
            if (this.arrayN[index] == user) {
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
        if (estado == 'RC') {
            estadoEscr = 'Radicado Causación de Cuenta';
        }
        if (estado == 'CP') {
            estadoEscr = 'Radicado Causación Pago';
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
        if (estado == 'Radicado Causación de Cuenta') {
            this.estadoActual = 'RC';
        }
        if (estado == 'Radicado Causación Pago') {
            this.estadoActual = 'CP';
        }
        console.log(this.estadoActual);

        if (this.estadoActual == 'PC' || this.estadoActual == 'CT' || this.estadoActual == 'PE') {
            this.bandera_archivo = true;
            this.nombre_archivo = estado;
        } else {
            this.bandera_archivo = false;
        }
    }

    estados(estado: any) {
        var bandera: any;
        this.permisos = localStorage.getItem('permisos');

        console.log("Holaaa!")
        console.log(this.permisos)
        console.log(estado)

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
                        this.arraySalida = this.array41;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Causación', 'error');
                }
            }
            if (estado == 'RC') {
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

            if (estado == 'CP' || estado == 'DC') {
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

            if (estado == 'CT' || estado == 'DC') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'PC' || this.arrayPermisos[index] == 'AD') {
                        this.arraySalida = this.array51;
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
                    console.log("Holaaa!!! :D");
                    console.log(this.arrayPermisos[index]);
                    if (this.arrayPermisos[index].trim() == 'P' || this.arrayPermisos[index] == 'AD') {
                        console.log("Holaaa!!! :D 2");

                        this.arraySalida = this.array8;
                        bandera = true;
                        this.btn = true;
                    }
                }
                if (bandera != true) {
                    Swal.fire('Error', 'Usted no tiene permisos para Pago 1', 'error');
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
        } else {
            Swal.fire('Error', 'Usted no tiene Permisos', 'error');
        }
    }

    evento(event) {
        this.observacion = event.target.value;
    }


    submit() {
        var datoU = JSON.parse(localStorage.getItem('identity'));

        datoU['sub'];

        this.itemF['numfac']; // actual

        this.teso13teso15 = new Teso13Teso15(this.itemF['codclas'], this.itemF['numero'], this.itemF['numfac'], this.estadoActual, this.estadoA, datoU['sub'], '', '', this.observacion);

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

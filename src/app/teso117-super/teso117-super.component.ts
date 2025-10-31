import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Teso15Service } from '../services/teso15.service';
import { Teso117Service } from '../services/teso117.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Gener02 } from '../models/gener02';
import { Teso113 } from '../models/teso113';
import { Teso13Teso15 } from '../models/teso13teso15';
import { global } from '../services/global';
import { Teso12Service } from '../services/teso12.service';
import { Documento } from '../models/documento';
import { Conta04 } from '../models/conta04';
import { Teso13Service } from '../services/teso13.service';
import { UploadService } from '../services/upload.service';
import { Teso22Service } from '../services/teso22.service';
import { Teso117 } from '../models/teso117';
import { Teso15new } from '../models/teso15new';
import { Gener02Service } from '../services/gener02.service';
import { Teso23Service } from '../services/teso23.service';

@Component({
  selector: 'app-teso117-super',
  templateUrl: './teso117-super.component.html',
  styleUrls: ['./teso117-super.component.scss'],
  providers: [Teso15Service, Teso117Service, Teso12Service, Teso13Service, UploadService, Teso22Service, Gener02Service, Teso23Service]
})
export class Teso117SuperComponent {

  selectedFiles: { [key: string]: File } = {};
  datos_pago: any;
  texto: string = '';
  maxLength: number = 299;
  bandera_archivo = false;
  resultado_caracteres: any;
  teso15: Teso15new;

  arbol_proceso: any = [];
  opcion1: any = '';
  opcionG: any = '';

  opciones_general: any = [];
  opcion_seleccionada: any = [];

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
  public identity_real: any;
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
  loading: boolean = false; // Bandera para indicar si se está cargando la vista
  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;
  nombre_archivo: any;
  teso117: Teso117;
  lista_historia_pago: any = [];
  seleccion_selected: any = '';
  estado_actual_actual: any = '';
  texto_observacion: string = '';

  constructor(private uploadService: UploadService,
    private route: ActivatedRoute,
    private _teso15Service: Teso15Service,
    private _teso117Service: Teso117Service,
    private _teso22Service: Teso22Service,
    private _gener02Service: Gener02Service,
    private _teso23Service: Teso23Service,
    private _router: Router) {
    this.teso15 = new Teso15new('', '', '', '', '', '', 0, '', '', '', '');
    this.identity_real = this._gener02Service.getIdentity();
    this.teso15.usuario = this.identity_real.sub;
    this.conta04 = new Conta04('', '');
    this.pdfSource = global.url + 'teso12/getDocumento/' + '009000004085Javeriana001.pdf'
    this.teso117 = new Teso117('');
    this.route.queryParams.subscribe(response => {
      const paramsData = JSON.parse(response['res2']);
      this.itemDetail = paramsData;
      this.item1 = this.itemDetail[0];
      this.data = this.getAllTeso13(this.item1[0]['codclas'], this.item1[0]['numero']);
      this.teso117.pago_id = this.item1[0]['codclas'];
      this.getTeso22First();
      this.teso15.codclas = this.item1[0]['codclas'];
      this.teso15.numero = this.item1[0]['numero']
      this.item2 = this.itemDetail[1][0];
      this.getHistoriaPago();
      for (let index = 0; index < this.item1.length; index++) {
        this.getUsuario(this.item1[index]['usuario']);
        this.estadoA = this.item1[index]['estado'];
        this.itemF = this.item1[index];
      }

      this.getEstadoPago()
    });
  }


  actualizarContadorTexto() {
    if (this.texto_observacion.length > 800) {
      this.texto_observacion = this.texto_observacion.substring(0, 800);
    }
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

    if (pdfContainer) {
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
      this.bandera_archivo = true;
    }
    this.datos_pago = dt;

  }

  uploadFiles() {

    this.loading = true;

    this._teso23Service.getPermisoForUsuario(this.teso15).subscribe(
      response => {
        this.loading = false;
        if (response.estado == true) {
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
                this.data.codtipag = '180';
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
                          this.enviar();
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
                this.enviar();
              }
            } else {
              Swal.fire('error!', 'Datos no enviados!', 'error');
            }
          })
        } else {
          Swal.fire({
            title: "Información!",
            text: "No tiene permisos para realizar este proceso!",
            icon: "info"
          }).then(() => {
            window.location.reload();
          });
        }
      }, error => {
        this.loading = false;
      }
    )
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

  getHistoriaPago() {

    this._teso22Service.getHistoriaPago(this.teso15).subscribe(
      response => {
        console.log("res!");
        console.log(response);
        this.lista_historia_pago = response;
      }
    );
  }


  getTeso22First() {
    this._teso22Service.getTeso22First(this.teso117).subscribe(
      response => {
        this.arbol_proceso = response;
        this.opcion1 = response[1]['source'];
        this._teso22Service.getEstadoPago(this.teso15).subscribe(
          response => {
            this.estado_actual_actual = response.estado;
            if (this.estado_actual_actual == 'RA') {
              for (let index = 0; index < this.arbol_proceso.length; index++) {
                if (this.arbol_proceso[index]['source'] == this.opcion1) {
                  this.opciones_general.push(this.arbol_proceso[index]);
                }
              }
            } else {
              for (let index = 0; index < this.arbol_proceso.length; index++) {
                if (this.arbol_proceso[index]['source'].trim() == this.estado_actual_actual.trim()) {
                  this.opciones_general.push(this.arbol_proceso[index]);
                }
              }
            }
          }
        )
      }
    )
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



  evento(event) {
    this.observacion = event.target.value;
  }


  submit() {
    var datoU = JSON.parse(localStorage.getItem('identityControlPagos'));

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


  cambio_estado(event) {
    this.opcion_seleccionada = [];
    for (let index = 0; index < this.opciones_general.length; index++) {
      if (this.opciones_general[index]['target'] == event.target.value) {
        this.opcion_seleccionada = this.opciones_general[index];
        this.teso15.estado = event.target.value;
      }
    }
  }

  ingrese_observacion(event) {

    this.teso15.observacion = event.target.value;

  }

  getEstadoPago() {
    this._teso22Service.getEstadoPago(this.teso15).subscribe(
      response => {
        this.estado_actual_actual = response.estado;
      }
    )
  }

  enviar() {

    Swal.fire({
      title: "¿Esta seguro de guardar?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.teso15.usuario = this.identity_real.sub;
        this.teso15.relacion = '0';
        this.loading = true;
        this._teso15Service.save(this.teso15).subscribe(
          response => {
            this.loading = false;
            if (response.status == 'success') {
              Swal.fire('Información', 'Cambios guardados!', 'success').then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire('Información', 'Cambios NO guardados!', 'error');
            }
          }, error => {
            this.loading = false;
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados", "", "info");
      }
    });

  }
}

import { Component, OnInit, HostListener } from '@angular/core';
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
  providers: [
    Teso15Service,
    Teso117Service,
    Teso12Service,
    Teso13Service,
    UploadService,
    Teso22Service,
    Gener02Service,
    Teso23Service
  ]
})
export class Teso117SuperComponent implements OnInit {

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
  public array8 = ['Aprobación de transferencia', 'Devuelto Causación', 'Anulado'];
  public array9 = ['Cheque en Firmas', 'Devuelto Causación', 'Devuelto Radicado', 'Anulado'];
  public array10 = ['Cheque Entregado', 'Devuelto Causación', 'Devuelto Radicado', 'Anulado'];
  public array11 = ['Pago Exitoso', 'Devuelto Causación', 'Anulado'];

  public btn = false;
  public data: any = '';
  public arraySalida: any[] = [];
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
  uploading: boolean = false;
  loading: boolean = false;
  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;
  nombre_archivo: any;
  teso117: Teso117;
  lista_historia_pago: any = [];
  seleccion_selected: any = '';
  estado_actual_actual: any = '';
  texto_observacion: string = '';

  // ✅ para validar/mostrar observación obligatoria
  observacion_texto: string = '';

  // =========================================================
  // ✅ VISOR PDF MODAL (ZOOM / ROTAR / DESCARGAR)
  // =========================================================
  showModal: boolean = false;
  selectedPdf: string = '';
  zoom: number = 1;
  rotation: number = 0;
  selectedSoporte: any = null;

  constructor(
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private _teso15Service: Teso15Service,
    private _teso117Service: Teso117Service,
    private _teso22Service: Teso22Service,
    private _gener02Service: Gener02Service,
    private _teso23Service: Teso23Service,
    private _router: Router
  ) {
    this.teso15 = new Teso15new('', '', '', '', '', '', 0, '', '', '', '');
    this.identity_real = this._gener02Service.getIdentity();
    this.teso15.usuario = this.identity_real.sub;

    this.conta04 = new Conta04('', '');
    this.pdfSource = global.url + 'teso12/getDocumento/' + '009000004085Javeriana001.pdf';
    this.teso117 = new Teso117('');

    this.route.queryParams.subscribe(response => {
      const paramsData = JSON.parse(response['res2']);
      this.itemDetail = paramsData;
      this.item1 = this.itemDetail[0];

      this.data = this.getAllTeso13(this.item1[0]['codclas'], this.item1[0]['numero']);
      this.teso117.pago_id = this.item1[0]['codclas'];

      this.getTeso22First();

      this.teso15.codclas = this.item1[0]['codclas'];
      this.teso15.numero = this.item1[0]['numero'];

      this.item2 = this.itemDetail[1][0];

      this.getHistoriaPago();

      for (let index = 0; index < this.item1.length; index++) {
        this.getUsuario(this.item1[index]['usuario']);
        this.estadoA = this.item1[index]['estado'];
        this.itemF = this.item1[index];
      }

      this.getEstadoPago();
    });
  }

  ngOnInit(): void { }

  // ✅ Cerrar modal con ESC
  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: KeyboardEvent) {
    if (this.showModal) this.cerrarModal();
  }

  // ✅ Abrir soporte en modal (sin preview en lista)
  abrirSoporte(url: string, so: any) {
    this.selectedPdf = url;
    this.selectedSoporte = so;
    this.zoom = 1;
    this.rotation = 0;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.selectedPdf = '';
    this.selectedSoporte = null;
  }

  zoomIn() {
    this.zoom = +(this.zoom + 0.25).toFixed(2);
  }

  zoomOut() {
    const next = this.zoom - 0.25;
    this.zoom = next < 0.5 ? 0.5 : +next.toFixed(2);
  }

  rotar() {
    this.rotation = (this.rotation + 90) % 360;
  }

  resetViewer() {
    this.zoom = 1;
    this.rotation = 0;
  }

  descargarSoporteSeleccionado() {
    if (!this.selectedSoporte) return;
    this.downloadPDF(this.selectedSoporte);
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

  onFileSelected(event: any, filename: string, dt: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[filename] = file;
      this.bandera_archivo = true;
    }
    this.datos_pago = dt;
  }

  private validarObservacionObligatoria(): boolean {
    const requiereObservacion =
      this.opcion_seleccionada?.observacion === 'SI' &&
      this.opcion_seleccionada?.detalle === 'S';

    if (!requiereObservacion) return true;

    const obs = (this.teso15?.observacion || '').trim();
    if (!obs) {
      Swal.fire({
        icon: 'warning',
        title: 'Observación obligatoria',
        text: 'Debes ingresar una observación para continuar.',
      });
      return false;
    }
    return true;
  }

  uploadFiles() {
    if (!this.validarObservacionObligatoria()) return;

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
                this.uploading = true;

                let data = new Teso113(this.datos_pago.codclas, this.datos_pago.numero);
                this.data.codtipag = '180';

                const formData = new FormData();
                Object.values(this.selectedFiles).forEach(file => {
                  formData.append('files[]', file);
                  formData.append('data[]', JSON.stringify(this.data));
                });

                this.uploadService.uploadArchivos(formData).subscribe(
                  response => {
                    this.uploading = false;
                    if (response.success) {
                      Swal.fire('info', 'Archivos subidos exitosamente: ' + response.files, 'info')
                        .then(() => this.enviar());
                    } else {
                      this.errorMessage = response.message;
                      Swal.fire('Error!', 'Error al subir archivos: ' + this.errorMessage, 'error');
                    }
                  },
                  error => {
                    this.uploading = false;
                    this.errorMessage = 'Error al subir archivos. Por favor, inténtalo de nuevo.';
                    Swal.fire('Error!', 'Error al subir archivos: ' + (error?.error?.message || ''), 'error');
                  }
                );
              } else {
                this.enviar();
              }
            } else {
              Swal.fire('error!', 'Datos no enviados!', 'error');
            }
          });
        } else {
          Swal.fire({
            title: "Información!",
            text: "No tiene permisos para realizar este proceso!",
            icon: "info"
          }).then(() => window.location.reload());
        }
      },
      () => { this.loading = false; }
    );
  }

  getHistoriaPago() {
    this._teso22Service.getHistoriaPago(this.teso15).subscribe(
      response => { this.lista_historia_pago = response; }
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
              for (let i = 0; i < this.arbol_proceso.length; i++) {
                if (this.arbol_proceso[i]['source'] == this.opcion1) {
                  this.opciones_general.push(this.arbol_proceso[i]);
                }
              }
            } else {
              for (let i = 0; i < this.arbol_proceso.length; i++) {
                if (this.arbol_proceso[i]['source'].trim() == this.estado_actual_actual.trim()) {
                  this.opciones_general.push(this.arbol_proceso[i]);
                }
              }
            }
          }
        );
      }
    );
  }

  getAllTeso13(codclas: any, numero: any) {
    this._teso15Service.getAllTeso13(new Teso113(codclas, numero)).subscribe(response => {
      this.data = response;
      this.traerSoportes();
    });
    return this.data;
  }

  sop1() { this.banderasop = true; }
  sop2() { this.banderasop = false; }

  nombreUsuario(user: any) {
    for (let i = 0; i < this.arrayN.length; i++) {
      if (this.arrayN[i] == user) {
        Swal.fire('Usuario encontrado', this.arrayN[i + 1], 'info');
        break;
      }
    }
  }

  getUsuario(user: any) {
    this._teso15Service.getUsuario(new Gener02(user, '')).subscribe(
      response => {
        if (response.status != 'error') {
          this.token = response;

          this._teso15Service.getUsuario(new Gener02(user, ''), this.v).subscribe(
            response => {
              this.identity = response;
              this.identity1 = this.identity[0]['nombre'];
              this.identity12 = this.identity[0]['usuario'];
              this.arrayN.push(this.identity[0]['usuario'], this.identity[0]['nombre']);
            }
          );
        }
      }
    );
  }

  traerSoportes() {
    this._teso117Service.traerSoportes(this.data).subscribe(
      response => { this.soportes = response; }
    );
  }

  getConta04(nit: any) {
    this.conta04.nit = nit;
    this._teso117Service.getConta04(this.conta04).subscribe(
      response => Swal.fire('Razon Social:', response.razsoc, 'info')
    );
  }

  cambio_estado(arg1: any, arg2?: any) {
    this.opcion_seleccionada = [];
    this.observacion_texto = '';
    this.teso15.observacion = '';

    if (arg1 && arg1.target !== undefined && arg1.target_detalle !== undefined) {
      const dt = arg1;
      this.opcion_seleccionada = dt;
      this.teso15.estado = dt.target;
      return;
    }

    const event = arg1;
    const selectedValue = event?.target?.value;

    for (let i = 0; i < this.opciones_general.length; i++) {
      if (this.opciones_general[i]['target'] == selectedValue) {
        this.opcion_seleccionada = this.opciones_general[i];
        this.teso15.estado = selectedValue;
        break;
      }
    }
  }

  ingrese_observacion(event: any) {
    this.observacion_texto = event?.target?.value || '';
    this.teso15.observacion = this.observacion_texto;
  }

  getEstadoPago() {
    this._teso22Service.getEstadoPago(this.teso15).subscribe(
      response => { this.estado_actual_actual = response.estado; }
    );
  }

  enviar() {
    if (!this.validarObservacionObligatoria()) return;

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
              Swal.fire('Información', 'Cambios guardados!', 'success')
                .then(() => this._router.navigate(['teso17']));
            } else {
              Swal.fire('Información', 'Cambios NO guardados!', 'error');
            }
          },
          () => { this.loading = false; }
        );
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados", "", "info");
      }
    });
  }
}

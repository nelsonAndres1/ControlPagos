import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Teso13Service } from '../services/teso13.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso12-upload',
  templateUrl: './teso12-upload.component.html',
  styleUrls: ['./teso12-upload.component.css'],
  providers: [UploadService, Teso13Service]
})
export class Teso12UploadComponent {

  datoSoportes: any;
  selectedFiles: { [key: string]: File } = {};
  uploading = false;
  errorMessage: string | null = null;
  permisos: any;
  itemDetail: any = [];
  status: any;
  banderaPermisos: any = true;
  contarPer: any = 0;
  datosArchivos: any[] = [];
  maxFileSize = 10000000; // 10MB

  // <<< NUEVO
  uploadToken = '';

  constructor(
    private uploadService: UploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: Teso13Service
  ) {
    this.datoSoportes = JSON.parse(localStorage.getItem('identity1') + '');
    this.permisos = this.datoSoportes[this.datoSoportes.length - 1]['obliga'];

    for (let i = 0; i < this.permisos.length; i++) {
      this.datoSoportes[i]['per'] = this.permisos[i];
      if (this.permisos[i] === 'S') {
        this.banderaPermisos = false;
        this.contarPer++;
      }
    }

    this._route.queryParams.subscribe(p => {
      const paramsData = JSON.parse(p['result']);
      this.itemDetail = paramsData;
      // <<< LEE EL TOKEN (query param primero; si no, desde itemDetail[0])
      this.uploadToken = p['uploadToken'] || this.itemDetail?.[0]?.upload_token || '';
    });
  }

  onFileSelected(event: any, filename: string, dt: any, fileInput: HTMLInputElement) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > this.maxFileSize) {
      Swal.fire('Archivo muy grande', 'El archivo supera los 10MB permitidos, por favor comprimir e intentar de nuevo!', 'warning');
      fileInput.value = '';
      return;
    }

    this.selectedFiles[filename] = file;

    // Elimina cualquier entrada previa del mismo codsop
    this.datosArchivos = this.datosArchivos.filter(x => x.codsop !== dt.codsop);

    // <<< NO ENVIAR numero; SÍ enviar upload_token
    this.datosArchivos.push({
      codclas: this.itemDetail[0].codclas,
      upload_token: this.uploadToken,     // CLAVE
      codsop: dt.codsop,
      entrego: 's',
      original: 's',
      nombre_original: file.name
    });

    // Actualiza permisos
    for (let i = 0; i < this.datoSoportes.length; i++) {
      if (this.datoSoportes[i].codsop === dt.codsop) {
        this.permisos[i] = 'N';
      }
    }
  }

  hasSelectedFiles(): boolean {
    // true si ya no quedan 'S' (obligatorios sin adjuntar)
    return !this.permisos.includes('S');
  }

  uploadFiles() {
    const formData = new FormData();

    // 1) Archivos
    Object.values(this.selectedFiles).forEach(file => {
      formData.append('files[]', file);
    });

    // 2) Metadatos — UNO por archivo (no metas todo el array repetido)
    this.datosArchivos.forEach(d => {
      formData.append('data[]', JSON.stringify(d));
    });

    this.uploading = true;

    // (si quisieras, podrías refrescar itemDetail aquí de nuevo)
    // this._route.queryParams.subscribe(...)

    this.uploadService.upload(formData).subscribe(
      response => {
        this.uploading = false;

        if (response.success) {
          Swal.fire('Info', 'Archivos subidos exitosamente: ' + response.files, 'info').then(() => {
            this.selectedFiles = {};

            // <<< Antes de registrar, coloca el token en el payload y elimina numero
            this.itemDetail[0].upload_token = this.uploadToken;
            if ('numero' in this.itemDetail[0]) delete this.itemDetail[0].numero;

            this._userService.register(this.itemDetail[0]).subscribe(
              r => {
                console.log('Registro exitoso:', r);
                if (r.status === 'success') {
                  this.status = r.status;
                  const arrayD = this.itemDetail[1];

                  const navigationExtras: NavigationExtras = {
                    queryParams: { result: JSON.stringify(arrayD),numeroPago:r.numero, uploadToken: this.uploadToken }
                  };

                  // Si quieres navegar tras registrar:
                  this._router.navigate(['teso113'], navigationExtras);
                  Swal.fire('Correcto!', 'Pago Enviado Exitosamente!', 'success');
                } else {
                  Swal.fire('Error!', r.error?.message || 'Error al registrar', 'error');
                  this.status = 'error';
                }
              },
              err => {
                Swal.fire('Error!', err.error?.message || 'Error al registrar', 'info').then(() => {
                  this._router.navigate(['teso10']);
                });
              }
            );
          });
        } else {
          this.errorMessage = response.message;
          Swal.fire('Error!', 'Error al subir archivos: ' + this.errorMessage, 'error');
        }
      },
      error => {
        this.uploading = false;
        Swal.fire('Error!', 'Error al subir archivos: ' + (error.error?.message || ''), 'error').then(() => {
          this.errorMessage = 'Error al subir archivos. Por favor, inténtalo de nuevo.';
          Swal.fire('Error!', this.errorMessage, 'error');
        });
      }
    );
  }

  obligatorio(dt: string) {
    return dt === 'S' ? 'OBLIGATORIO' : 'NO OBLIGATORIO';
  }
}

import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';

import { UploadService } from '../services/upload.service';
import { Teso13Service } from '../services/teso13.service';

interface Soporte {
  codsop: string;
  detsop?: string;
  obliga?: any;     // 1 | 0 | 'S' | 'N' | boolean
  per?: 'S' | 'N';
  [k: string]: any;
}

interface ItemDetail0 {
  codclas?: string;
  upload_token?: string;
  numero?: any;
  [k: string]: any;
}

@Component({
  selector: 'app-teso12-upload',
  templateUrl: './teso12-upload.component.html',
  styleUrls: ['./teso12-upload.component.css'],
  providers: [UploadService, Teso13Service]
})
export class Teso12UploadComponent {

  datoSoportes: Soporte[] = [];
  selectedFiles: { [key: string]: File } = {};
  uploading = false;
  errorMessage: string | null = null;
  permisos: ('S' | 'N')[] = [];
  itemDetail: any[] = [];
  status: any;
  banderaPermisos: boolean = true;
  contarPer: number = 0;
  datosArchivos: any[] = [];
  //maxFileSize = 10_000_000; // 10MB
  maxFileSize = 100_000_000; // 100 MB
  uploadToken = '';

  constructor(
    private uploadService: UploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: Teso13Service
  ) {
    // ------- Cargar soportes desde localStorage -------
    const raw = localStorage.getItem('identity1');
    try {
      const parsed = JSON.parse(raw ?? '[]');
      this.datoSoportes = Array.isArray(parsed) ? parsed : [];
    } catch {
      this.datoSoportes = [];
    }

    // ------- Normalizar permisos a ['S'|'N'] -------
    this.permisos = this.datoSoportes.map((s: Soporte) => {
      const v = s?.obliga;
      return (v === 1 || v === '1' || v === true || v === 'S') ? 'S' : 'N';
    });

    // Copiar estado de permiso en cada soporte (opcional)
    this.datoSoportes = this.datoSoportes.map((s, i) => ({ ...s, per: this.permisos[i] }));

    this.banderaPermisos = !this.permisos.includes('S');
    this.contarPer = this.permisos.filter(p => p === 'S').length;

    console.log('soportes:', this.datoSoportes);
    console.log('permisos:', this.permisos);

    // ------- Leer query params -------
    this._route.queryParams.subscribe(p => {
      try {
        this.itemDetail = p['result'] ? JSON.parse(p['result']) : [];
      } catch {
        this.itemDetail = [];
      }
      this.uploadToken = p['uploadToken'] || this.itemDetail?.[0]?.upload_token || '';
    });
  }

  // Mostrar etiqueta de obligatoriedad
  obligatorio(val: string | 'S' | 'N'): string {
    return val === 'S' ? 'OBLIGATORIO' : 'NO OBLIGATORIO';
  }

  // Validación de si ya adjuntaron todos los obligatorios
  hasSelectedFiles(): boolean {
    if (!Array.isArray(this.permisos)) return true;
    // true => no quedan 'S' pendientes
    return !this.permisos.some(p => p === 'S');
  }

  onFileSelected(event: any, filename: string, dt: Soporte, fileInput: HTMLInputElement) {
    const file1 = event?.target?.files?.[0] as File | undefined;
    if (!file1) return;
    const newName = file1.name.replace(/#/g, "");
    const file = new File([file1], newName, { type: file1.type });
    
    if (file.size > this.maxFileSize) {
      Swal.fire('Archivo muy grande', 'El archivo supera los 10MB permitidos, por favor comprimir e intentar de nuevo!', 'warning');
      fileInput.value = '';
      return;
    }

    // Registrar archivo por "slot" (filename)
    this.selectedFiles[filename] = file;

    // Quitar entradas previas del mismo codsop en metadatos
    this.datosArchivos = this.datosArchivos.filter(x => x.codsop !== dt.codsop);

    // Agregar metadato de este archivo
    const codclas = this.itemDetail?.[0]?.codclas ?? '';
    this.datosArchivos.push({
      codclas,
      upload_token: this.uploadToken,  // CLAVE
      codsop: dt.codsop,
      entrego: 's',
      original: 's',
      nombre_original: file.name
    });

    // Actualizar permisos: marcar como atendido ('N') el soporte de este codsop
    const idx = this.datoSoportes.findIndex((s: Soporte) => s?.codsop === dt.codsop);
    if (idx >= 0) {
      this.permisos[idx] = 'N';
      this.datoSoportes[idx].per = 'N';
    }

    // Recalcular bandera y conteo
    this.banderaPermisos = !this.permisos.includes('S');
    this.contarPer = this.permisos.filter(p => p === 'S').length;
  }

  uploadFiles() {
    // Validación mínima
    if (Object.keys(this.selectedFiles).length === 0) {
      Swal.fire('Info', 'No hay archivos seleccionados para subir.', 'info');
      //return;
    }
    if (!this.uploadToken) {
      Swal.fire('Error', 'Falta upload_token en la navegación (query param o itemDetail[0]).', 'error');
      return;
    }

    const formData = new FormData();

    // 1) Adjuntar archivos
    for (const file of Object.values(this.selectedFiles)) {
      formData.append('files[]', file);
    }

    // 2) Adjuntar metadatos (uno por archivo)
    this.datosArchivos.forEach(d => {
      formData.append('data[]', JSON.stringify(d));
    });

    this.uploading = true;

    this.uploadService.upload(formData).subscribe(
      (response: any) => {
        this.uploading = false;

        if (response?.success) {
          Swal.fire('Info', 'Archivos subidos exitosamente: ' + (response.files ?? ''), 'info').then(() => {
            // Limpiar selección
            this.selectedFiles = {};

            // Preparar registro (sin campo numero)
            const detail0: ItemDetail0 = { ...(this.itemDetail?.[0] ?? {}) };
            detail0.upload_token = this.uploadToken;
            if ('numero' in detail0) delete (detail0 as any).numero;

            this._userService.register(detail0).subscribe(
              (r: any) => {
                if (r?.status === 'success') {
                  this.status = r.status;
                  const arrayD = this.itemDetail?.[1] ?? {};

                  const navigationExtras: NavigationExtras = {
                    queryParams: {
                      result: JSON.stringify(arrayD),
                      numeroPago: r.numero ?? '',
                      uploadToken: this.uploadToken
                    }
                  };

                  // Navega a la siguiente pantalla
                  this._router.navigate(['teso113'], navigationExtras);
                  Swal.fire('Correcto!', 'Pago Enviado Exitosamente!', 'success');
                } else {
                  Swal.fire('Error!', r?.error?.message || 'Error al registrar', 'error');
                  this.status = 'error';
                }
              },
              (err: any) => {
                Swal.fire('Error!', err?.error?.message || 'Error al registrar', 'info').then(() => {
                  this._router.navigate(['teso10']);
                });
              }
            );
          });
        } else {
          this.errorMessage = response?.message || 'Respuesta inválida del servicio de carga.';
          Swal.fire('Error!', 'Error al subir archivos: ' + this.errorMessage, 'error');
        }
      },
      (error: any) => {
        this.uploading = false;
        const msg = error?.error?.message || 'Error al subir archivos. Por favor, inténtalo de nuevo.';
        this.errorMessage = msg;
        Swal.fire('Error!', msg, 'error');
      }
    );
  }
}

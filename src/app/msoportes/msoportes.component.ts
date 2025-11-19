import { Component } from '@angular/core';
import { EditarSoportesService } from '../services/editarSoportes.service';
import { EditarSoportes } from '../models/editarSoportes';
import { Gener02Service } from '../services/gener02.service';
import { Teso13Service } from '../services/teso13.service';
import { UploadService } from '../services/upload.service';
import { global } from '../services/global';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-msoportes',
  templateUrl: './msoportes.component.html',
  styleUrls: ['./msoportes.component.css'],
  providers: [EditarSoportesService, Gener02Service, Teso13Service, UploadService]
})
export class MsoportesComponent {

  data: any[] = [];  
  soportes_: any[] = [];
  vacio: any = null;
  editarSoportes: EditarSoportes;
  identity: any;
  global_url = global.url;
  bandera = false;
  link = '';
  selectedFiles: { [key: string]: File } = {};
  datosArchivos: any[] = [];
  codclas: string | null = null;
  numero: string | number | null = null;
  uploading: boolean = false;
  errorMessage: string | null = null;
  observacionEliminar: string = ''; 
  deletingIds: Set<number | string> = new Set();

  constructor(
    private _editarSoportesService: EditarSoportesService,
    private uploadService: UploadService,
    private _teso13Service: Teso13Service,
    private _gener02Service: Gener02Service,
    private router: Router

  ) {
    this.editarSoportes = new EditarSoportes('');
    this.identity = this._gener02Service.getIdentity();

    const usuariosPermitidos = [
      '1180',
      '1750'
    ];

    if (usuariosPermitidos.includes(this.identity.sub)) {
    } else {
      this.router.navigate(['principal']);
    }
  }

  // Seleccionar un pago y cargar sus soportes
  getTeso13_all(codclas: string, numero: string | number) {
    const keyword = `${codclas}${numero}`;
    this.codclas = codclas;
    this.numero = numero;

    if (keyword.length >= 10) {
      this.editarSoportes.numero = keyword;
      this._editarSoportesService.getInfoPagoeditar(this.editarSoportes).subscribe({
        next: (response: any) => {
          this.soportes_ = response || [];

          console.log('Soportes cargados:');
          console.log(this.soportes_);

          // cerrar visor al cambiar de pago
          this.bandera = false;
          this.link = '';
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudieron cargar los soportes del pago.', 'error');
        }
      });
    }
  }

  // Búsqueda de pagos
  getTeso13(event: any) {
    this.data = [];
    const keyword: any = {
      keyword: event?.target?.value ?? '',
      usuario: this.identity?.sub
    };

    this._teso13Service.searchTeso13editarsop(keyword).subscribe({
      next: (response: any) => this.data = response || [],
      error: (err) => {
        console.error(err);
        this.data = [];
      }
    });
  }

  // Ver archivo en visor
  ver(nombreArchivo: string) {
    if (nombreArchivo) {
      this.bandera = true;
      this.link = nombreArchivo;
    } else {
      this.bandera = false;
      this.link = '';
    }
  }

  // Selección de archivo para reemplazo
  onFileSelected(event: any, filenameKey: string, dt: any) {
    const file1: File | undefined = event?.target?.files?.[0];
    if (!file1) return;

    // Sanitizar nombre (ej: quitar #)
    const newName = file1.name.replace(/#/g, '');
    const file = new File([file1], newName, { type: file1.type });

    // Guardar selección
    this.selectedFiles[filenameKey] = file;

    // Preparar metadatos a enviar
    // Si ya hay registro para ese codsop, lo reemplazamos
    const idx = this.datosArchivos.findIndex(x => x.codsop == dt.codsop);
    const payload = {
      id: dt.id,
      codclas: this.codclas,
      numero: this.numero,
      codsop: dt.codsop,
      entrego: 's',
      original: 's',
      nombre_original: this.selectedFiles[filenameKey].name
    };

    if (idx >= 0) {
      this.datosArchivos.splice(idx, 1);
    }
    this.datosArchivos.push(payload);

    // Subir de inmediato
    this.uploadFiles();
  }

  // Carga de archivos seleccionados
  uploadFiles() {
    const formData = new FormData();

    // Archivos
    Object.values(this.selectedFiles).forEach((file: File) => {
      formData.append('files[]', file);
    });

    // Metadatos (una sola vez con todo el arreglo)
    formData.append('data[]', JSON.stringify(this.datosArchivos));

    this.uploading = true;

    this.uploadService.uploadUpdateadmin(formData).subscribe({
      next: (response: any) => {
        this.uploading = false;
        if (response?.success) {
          Swal.fire('Info', 'Archivos subidos exitosamente: ' + (response.files || ''), 'info');
          // refrescar soportes si backend actualiza nombres
          if (this.codclas && this.numero) {
            this.getTeso13_all(this.codclas, this.numero);
          }
        } else {
          this.errorMessage = response?.message || 'Error al subir archivos';
          Swal.fire('Error', 'Error al subir archivos: ' + this.errorMessage, 'error');
        }
      },
      error: (error) => {
        this.uploading = false;
        const msg = error?.error?.message || 'Error al subir archivos. Por favor, inténtalo de nuevo.';
        this.errorMessage = msg;
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  // Confirmación de eliminación
  confirmEliminar(dt: any) {
    const detalle = dt?.detalle_codsop ?? '';
    const archivo = dt?.archivo ?? '';

    Swal.fire({
      title: '¿Eliminar soporte?',
      html: `
      <div style="text-align:left">
        <b>Código soporte:</b> ${dt.codsop}<br>
        <b>Detalle:</b> ${detalle || '—'}<br>
        <b>Archivo:</b> ${archivo || '—'}<br><br>
        <label for="observacion" style="font-weight:bold;">Observación (máx. 1000 caracteres):</label>
        <textarea id="observacion" class="swal2-textarea"
          placeholder="Escribe el motivo de eliminación..."
          maxlength="1000"
          style="width:100%; height:100px; resize:none;"></textarea>
      </div>
    `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      preConfirm: () => {
        const observacion = (document.getElementById('observacion') as HTMLTextAreaElement)?.value?.trim();
        if (!observacion) {
          Swal.showValidationMessage('Debe ingresar una observación para eliminar el soporte.');
          return false;
        }
        if (observacion.length > 1000) {
          Swal.showValidationMessage('La observación no puede superar los 1000 caracteres.');
          return false;
        }
        return observacion;
      }
    }).then(r => {
      if (r.isConfirmed && r.value) {
        this.observacionEliminar = r.value; // Guarda en variable global
        /* console.log('Observación para eliminar:', dt); */
        
        this.eliminarSoporte(dt);
      }
    });
  }


  // Llamada al servicio para eliminar el soporte
  private eliminarSoporte(dt: any) {
    if (!this.codclas || !this.numero) {
      Swal.fire('Atención', 'Primero selecciona un pago (codclas + número).', 'info');
      return;
    }

    console.log('Eliminando soporte:', dt);

    const payload = {
      id: dt.id,
      codclas: this.codclas,
      numero: this.numero,
      codsop: dt.codsop,
      archivo: dt.archivo,
      usuario: this.identity?.sub,
      observacion: this.observacionEliminar // opcional: por si backend borra el físico
    };

    // Marcar fila en eliminación
    this.deletingIds.add(dt.codsop);

    this._editarSoportesService.deleteSoporte(payload).subscribe({
      next: (resp: any) => {
        // Cerrar visor si el archivo eliminado estaba abierto
        if (this.link && dt.archivo && this.link === dt.archivo) {
          this.bandera = false;
          this.link = '';
        }

        // Opción A: dejar fila y limpiar nombre de archivo
        this.soportes_ = (this.soportes_ || []).map((s: any) => {
          if (s.codsop === dt.codsop) {
            return { ...s, archivo: null };
          }
          return s;
        });

        // Opción B (alternativa): remover fila completamente
        // this.soportes_ = (this.soportes_ || []).filter((s: any) => s.codsop !== dt.codsop);

        this.deletingIds.delete(dt.codsop);
        Swal.fire('Eliminado', 'El soporte ha sido eliminado correctamente.', 'success');
      },
      error: (err) => {
        this.deletingIds.delete(dt.codsop);
        const msg = err?.error?.message || 'No fue posible eliminar el soporte.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}

import { Component } from '@angular/core';
import { EditarSoportesService } from '../services/editarSoportes.service';
import { EditarSoportes } from '../models/editarSoportes';
import { Gener02Service } from '../services/gener02.service';
import { Teso13Service } from '../services/teso13.service';
import { UploadService } from '../services/upload.service';
import { global } from '../services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-soportes',
  templateUrl: './editar-soportes.component.html',
  styleUrls: ['./editar-soportes.component.css'],
  providers: [EditarSoportesService, Gener02Service, Teso13Service, UploadService]
})
export class EditarSoportesComponent {

  data
  soportes: any;
  vacio: any = null;
  editarSoportes: EditarSoportes;
  identity: any;
  soportes_: any;
  global_url = global.url;
  bandera = false;
  link = '';
  selectedFiles: { [key: string]: File } = {}; // Objeto para almacenar archivos seleccionados
  datosArchivos: any = [];
  codclas: any;
  numero: any;
  uploading: boolean = false; // Bandera para indicar si se está subiendo archivos
  errorMessage: string | null = null;

  constructor(private _editarSoportesService: EditarSoportesService, private uploadService: UploadService, private _teso13Service: Teso13Service, private _gener02Service: Gener02Service) {
    this.editarSoportes = new EditarSoportes('');
    this.identity = this._gener02Service.getIdentity();

  }

  getTeso13_all(codclas, numero) {
    const keyword = codclas + numero;
    this.codclas = codclas;
    this.numero = numero;
    if (keyword.length >= 10) {
      console.log("!holaaa")
      this.editarSoportes.numero = keyword;
      this._editarSoportesService.getInfoPago(this.editarSoportes).subscribe(
        response => {
          this.soportes_ = response;
        }, error => {
          console.log(error);
        }
      )
    }
  }

  traer(data: any) {

  }

  getTeso13(event) {
    this.data = [];
    const keyword: any = {};
    keyword.keyword = event.target.value;
    keyword.usuario = this.identity.sub;
    const search = this._teso13Service.searchTeso13(keyword).subscribe(response => {
      this.data = response;

      console.log(this.data);

    });
  }

  getPago(res: any) {

  }

  ver(dt) {
    if (dt != '') {
      this.bandera = true;
      this.link = dt;
    } else {
      this.bandera = false;
    }
  }

  onFileSelected(event, filename, dt) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[filename] = file;
      var bandera = false;
      if (this.datosArchivos.length > 0) {
        for (let index = 0; index < this.datosArchivos.length; index++) {
          if (this.datosArchivos[index].codsop == dt.codsop) {
            this.datosArchivos.splice(index, 1);
            bandera = true;
          }
        }
        this.datosArchivos.push({ 'codclas': this.codclas, 'numero': this.numero, 'codsop': dt.codsop, 'entrego': 's', 'original': 's', 'nombre_original': this.selectedFiles[filename].name })
        for (let index = 0; index < this.soportes_.length; index++) {
          if (this.soportes_[index].codsop == dt.codsop) {

          }
        }
      } else {
        this.datosArchivos.push({ 'codclas': this.codclas, 'numero': this.numero, 'codsop': dt.codsop, 'entrego': 's', 'original': 's', 'nombre_original': this.selectedFiles[filename].name })

        for (let index = 0; index < this.soportes_.length; index++) {
          if (this.soportes_[index].codsop == dt.codsop) {

          }
        }
      }
    }
    console.log("archivosss!!!!")
    console.log(this.datosArchivos)
    console.log("fileee!!!!")
    console.log(this.selectedFiles)
    this.uploadFiles()
  }

  uploadFiles() {
    console.log("archivosss2!!!!")
    console.log(this.datosArchivos)
    console.log("fileee2!!!!")
    console.log(this.selectedFiles)
    const formData = new FormData();
    Object.values(this.selectedFiles).forEach(file => {
      formData.append('files[]', file);
      formData.append('data[]', JSON.stringify(this.datosArchivos));
    });

    this.uploading = true;

    console.log("form!")
    console.log(formData)

    this.uploadService.uploadUpdate(formData)
      .subscribe(
        response => {
          this.uploading = false;
          if (response.success) {
            Swal.fire('info', 'Archivos subidos exitosamente:' + response.files, 'info').then(() => {
              /* window.location.reload() */
            });
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
  }

}

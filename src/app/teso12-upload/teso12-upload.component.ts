import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
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
  selectedFiles: { [key: string]: File } = {}; // Objeto para almacenar archivos seleccionados
  uploading: boolean = false; // Bandera para indicar si se está subiendo archivos
  errorMessage: string | null = null;
  permisos: any;
  itemDetail: any = [];
  status: any;
  banderaPermisos: any = true;
  contarPer: any = 0;
  datosArchivos: any = [];

  constructor(
    private uploadService: UploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: Teso13Service) {

    this.datoSoportes = JSON.parse(localStorage.getItem('identity1') + '');
    console.log("dato!");
    console.log(this.datoSoportes);
    this.permisos = this.datoSoportes[this.datoSoportes.length - 1]['obliga']; // agre
    console.log(this.permisos);
    for (let index = 0; index < this.permisos.length; index++) {
      this.datoSoportes[index]['per'] = this.permisos[index];
    }
    for (let index = 0; index < this.permisos.length; index++) {
      if (this.permisos[index] == 'S') {
        this.banderaPermisos = false;
        this.contarPer = this.contarPer + 1;
      }
    }
    this._route.queryParams.subscribe(response => {
      const paramsData = JSON.parse(response['result']);
      this.itemDetail = paramsData;
    });

  }

  onFileSelected(event: any, filename: string, dt: any) {
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
        this.datosArchivos.push({ 'codclas': this.itemDetail[0].codclas, 'numero': this.itemDetail[0].numero, 'codsop': dt.codsop, 'entrego': 's', 'original': 's', 'nombre_original': this.selectedFiles[filename].name })

        for (let index = 0; index < this.datoSoportes.length; index++) {
          if (this.datoSoportes[index].codsop == dt.codsop) {
            this.permisos[index] = 'N';
          }
        }


      } else {
        this.datosArchivos.push({ 'codclas': this.itemDetail[0].codclas, 'numero': this.itemDetail[0].numero, 'codsop': dt.codsop, 'entrego': 's', 'original': 's', 'nombre_original': this.selectedFiles[filename].name })

        for (let index = 0; index < this.datoSoportes.length; index++) {
          if (this.datoSoportes[index].codsop == dt.codsop) {
            this.permisos[index] = 'N';
          }
        }
      }
      console.log("perrr");
      console.log(this.permisos);
    }
  }

  hasSelectedFiles(): boolean {

    if (!this.permisos.includes('S')) {
      return true;
    } else {
      return false;
    }

  }

  uploadFiles() {

    const formData = new FormData();
    Object.values(this.selectedFiles).forEach(file => {
      formData.append('files[]', file);
      formData.append('data[]', JSON.stringify(this.datosArchivos));
    });

    this.uploading = true;

    this._route.queryParams.subscribe(response => {
      const paramsData = JSON.parse(response['result']);
      this.itemDetail = paramsData;
    });



    this.uploadService.upload(formData)
      .subscribe(
        response => {
          this.uploading = false;
          if (response.success) {
            Swal.fire('info', 'Archivos subidos exitosamente:' + response.files, 'info').then(() => {
              this.selectedFiles = {};
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
                  Swal.fire('Correcto!', 'Pago Enviado Existosamente!', 'success');

                } else {

                  Swal.fire('Error!', response.error.message, 'error');
                  this.status = 'error';
                }
              }, error => {
                Swal.fire('Error!', error.error.message, 'info').then(() => {
                  this._router.navigate(['teso10']);
                });

              });
            });

          } else {
            this.errorMessage = response.message;
            console.log("error!")
            console.log(this.errorMessage);
            Swal.fire('Error!', 'Error al subir archivos:' + this.errorMessage, 'error');
          }
        },
        error => {
          this.uploading = false;
          Swal.fire('Error!', 'Error al subir archivos: ' + error.error.message, 'error');

          this.errorMessage = 'Error al subir archivos. Por favor, inténtalo de nuevo.';
        }
      );
  }

  obligatorio(dt) {
    if (dt == 'S') {
      return "OBLIGATORIO"
    } else {
      return "NO OBLIGATORIO"
    }
  }
}

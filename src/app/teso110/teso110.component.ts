import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {teso10} from '../models/teso10';
import {teso110} from '../models/teso110';
import {Teso10Service} from '../services/teso10.service';
import Swal from 'sweetalert2';
import {Router, NavigationExtras} from '@angular/router';
import {Teso14Service} from '../services/teso14.service';
import {Teso110Service} from '../services/teso110.service';
import { identity } from 'rxjs';

@Component({
    selector: 'app-teso110',
    templateUrl: './teso110.component.html',
    styleUrls: ['./teso110.component.css'],
    providers: [Teso10Service, Teso14Service, Teso10Service, Teso110Service]
})
export class Teso110Component implements OnInit {

    public teso10 : teso10;
    public teso110 : teso110;

    public status : any;
    public status2 : any;
    data : any;
    constructor(private _teso10Service : Teso10Service, private _router : Router, private _teso14Service : Teso14Service, private _teso110Service : Teso110Service) {

        this.teso10 = new teso10('', '', '', '');

    }

    ngOnInit(): void {}

    getTPagos(pclave : any) {
        const keyword = pclave.target.value;
        const search = this._teso14Service.getTPago(keyword).then(response => {
            this.data = response;
            this.data;


        });
    }

    getDetailPage(result : any) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(result)
            }
        }

    }
    update(cd : any, de : any, es : any) {
        Swal.fire({
            title: '¿Desea Modificar el Nombre o el Estado del Pago?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Nombre',
            denyButtonText: `Estado`
        }).then((result) => {

            if (result.isConfirmed) {
               
                Swal.fire({
                    title: 'Ingrese El Nuevo Nombre del Pago',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Enviar',
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        this._teso110Service.update(new teso110(cd, result.value, es)).subscribe(response => {
                            if (response.status == "success") {
                                this.status2 = response.status;
                            } else {
                                this.status2 = 'error';
                            }
                        }, error => {
                            this.status2 = 'error';
                            console.log(< any > error);
                        });
                        
                    } else {
                        Swal.fire('Cancelado!', '', 'error');
                    }
                })
            } else if (result.isDenied) {
               
                Swal.fire({
                    title: 'Ingrese El Nuevo Estado del Pago',
                    input: 'select',
                    showCancelButton: true,
                    confirmButtonText: 'Enviar',
                    showLoaderOnConfirm: true,
                    inputOptions: {
                        'Estado': {
                            Activo: 'Activo',
                            Inactivo: 'Inactivo'
                        }
                    }
                }).then((result) => {
                    var r;
                    if (result.isConfirmed) {
                        if (result.value == 'Activo') {
                            r = 'A'
                        } else {
                            r = 'I'
                        }
                        this._teso110Service.update(new teso110(cd, de, r)).subscribe(response => {
                            if (response.status == "success") {
                                this.status2 = response.status;
                            } else {
                                this.status2 = 'error';
                            }
                        }, error => {
                            this.status2 = 'error';
                            console.log(< any > error);
                        });
                        
                    } else {
                        Swal.fire('Cancelado!', '', 'error');
                    }
                })
            }
        })
    }
    delete(v1 : any) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: '¿Estas Seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                this._teso110Service.delete(new teso110(v1, '', '')).subscribe(
                    response => {
                        if(response.status == "success"){
                            this.status2 = response.status;
                        }else{
                            this.status2 = 'error';
                        }
                    }, error => {
                        this.status2 = 'error';
                        console.log(<any>error);
                    });
                    console.log(v1, "eliminado");
              swalWithBootstrapButtons.fire(
                'Eliminado!',
                'El Pago '+v1+' ha sido eliminado',
                'success'
              )

            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'El Pago '+v1+' no ha sido eliminado',
                'error'
              )
            }
          })
    }


    onSubmit(form) {
        Swal.fire({

            title: "¿Estas Seguro?",
            text: "Agregaras un nuevo Pago",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'

        }).then(result => {

            if (result.value) {

                this._teso10Service.register(this.teso10).subscribe(response => {
                    if (response.status == "success") {
                        this.status = response.status;

                        form.reset();

                    } else {
                        this.status = 'error';
                    }
                }, error => {

                    this.status = 'error';
                    console.log(< any > error);

                });

                console.log('yes');
                Swal.fire('Listo!', 'Pago Agregado', 'success');

            } else {

                console.log('No!');
                Swal.fire('Cancelado!', 'Pago No Agregado', 'error');

            }
        });

    }

}

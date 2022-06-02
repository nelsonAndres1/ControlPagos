import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {teso12} from '../models/teso12';
import {Teso12Service} from '../services/teso12.service';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {Teso112Service} from '../services/teso112.service';
import {Teso11} from '../models/teso11';
import { identity } from 'rxjs';
import {Teso14Service} from '../services/teso14.service';

@Component({
    selector: 'app-teso112',
    templateUrl: './teso112.component.html',
    styleUrls: ['./teso112.component.css'],
    providers: [Teso12Service, Teso112Service]
})
export class Teso112Component implements OnInit {
    data : any;
    public teso12 : teso12;
    public status : any;
    public status2 : any;
    public teso11 : Teso11;
    public dataSoportes : any;

    constructor(private _teso112Service : Teso112Service, private _teso12Service : Teso12Service, private _router : Router, private _teso14Service : Teso14Service) {
        this.teso12 = new teso12('');
        //this.getTSoportes1();
        this.soportes1();

    }

    soportes1() {
        const sopor = this._teso14Service.getTsoportes({}).subscribe(response => {
            this.dataSoportes = response;
        
        });
        return this.dataSoportes;
    }


    ngOnInit(): void {}

    getTSoportes(pclave : any) {
        const keyword = pclave.target.value;
        const search = this._teso112Service.getTsoportes(keyword).then(response => {
            this.data = response;
        });
    }
    getDetailPage(result : any) {

        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(result)
            }
        }

    }

    update(v1 : any) {

        Swal.fire({
            title: 'Ingrese El Nuevo Nombre del Soporte',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.isConfirmed) {

                this._teso112Service.update(new Teso11(v1, result.value)).subscribe(response => {
                    if (response.status == "success") {
                        this.status2 = response.status;

                    } else {
                        this.status2 = 'error';
                    }
                }, error => {
                    this.status2 = 'error';
                    console.log(< any > error);
                });
                console.log(v1, ' ', result.value);
                Swal.fire({
                        title: `"${
                        result.value
                    }"` + ` es el nuevo nombre del soporte: ` + v1
                })
            } else {
                Swal.fire('Cancelado!', '', 'error');
            }
        })

    }

    delete(v1:any){
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
                this._teso112Service.delete(new Teso11(v1, '')).subscribe(
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
              swalWithBootstrapButtons.fire(
                'Eliminado!',
                'El soporte '+v1+' ha sido eliminado',
                'success'
              )

            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'El Soporte '+v1+' no ha sido eliminado',
                'error'
              )
            }
          })
    }


    onSubmit(form) {
        Swal.fire({

            title: "¿Estas Seguro?",
            text: "Agregaras un nuevo Soporte",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'

        }).then(result => {

            if (result.value) {

                this._teso12Service.register(this.teso12).subscribe(response => {
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
                Swal.fire('Listo!', 'Soporte Agregado', 'success');
                form.update();

            } else {

                console.log('No!');
                Swal.fire('Cancelado!', 'Soporte No Agregado', 'error');
                form.update();

            }
        });


    }

}

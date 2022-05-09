import {Component, OnInit} from '@angular/core';
import {Teso14Service} from '../services/teso14.service';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import Swal from 'sweetalert2';
import {teso112} from '../models/teso112';
import { identity } from 'rxjs';

@Component({selector: 'app-teso114', 
            templateUrl: './teso114.component.html', 
            styleUrls: ['./teso114.component.css']
})
export class Teso114Component implements OnInit {
    data : any;
    itemDetail : any = [];
    grupoSoportes : any = [];
    array = [];
    ao = [];
    ap = [];
    public status : any;
    sw : any;
    sw1 : any;
    public teso112 : teso112;
    constructor(private route : ActivatedRoute,
                private _teso14Service : Teso14Service,
                fb : FormBuilder, 
                private _router : Router
                ) {

        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
            this.itemDetail.estado;
        });
        this.grupoSoportes = this.getTsoportes();
        
        this.grupoSoportes = fb.group({selected: new FormArray([])});

    }

    estado(): boolean {
        var res = false;
        if (this.itemDetail.estado == 'A') {
            res = true;
        } else {
            res = false;
        }
        return res;
    }

    getTsoportes() {
        const sopor = this._teso14Service.getTsoportes({}).subscribe(response => {
            this.data = response;
        
        });
        return this.data;
    }

    confirmacionesSO(arrayo = [], arrayp = []) {
        this.sw1 = Swal;
        this.sw1.fire({

            title: "¿El soporte sera obligatorio?",
            text: "Soporte",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737'

        }).then(result => {

            if (result.value) {

                arrayo.push('S');
                this.sw1.fire('Listo!', 'El Soporte sera Obligatorio', 'success');

                this.sw = Swal;
                this.sw.fire({
                    title: "¿El soporte sera solicitado por primera vez?",
                    text: "",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                    confirmButtonColor: '#4BB543',
                    cancelButtonColor: '#EA1737'

                }).then(result => {

                    if (result.value) {
                        arrayp.push('S');
                        this.sw.fire('Listo!', '', 'success');
                    } else {
                        arrayp.push('N');
                        this.sw.fire('Listo!', '', 'info');
                    }
                });
            } else {
                arrayo.push('N');
                this.sw1.fire('Listo!', '', 'info');
                this.sw = Swal;

                this.sw.fire({
                    title: "¿El soporte sera solicitado por primera vez?",
                    text: "",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                    confirmButtonColor: '#4BB543',
                    cancelButtonColor: '#EA1737'

                }).then(result => {
                    if (result.value) {

                        arrayp.push('S');
                        this.sw.fire('Listo!', '', 'success');

                    } else {

                        arrayp.push('N');
                        this.sw.fire('Listo!', '', 'info');

                    }
                });
            }
        });
    }

    onChange($event, result : any) {

        var bandera = false;
        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(result)
            }
        }
        const isChecked = $event.target.checked;

        if (isChecked == true) {
            if (this.array.length > 0) {
                for (let index = 0; index <= this.array.length; index++) {
                    if (this.array[index] == result) {
                        console.log(this.array[index]);
                        console.log(result);
                        bandera = true;
                    }
                }
                if (bandera != true) {
        
                    this.array.push(result);

                    this.confirmacionesSO(this.ao, this.ap);
                }
            } else {
                this.array.push(result);

                this.confirmacionesSO(this.ao, this.ap);
            }
        } else {
            for (let index = 0; index <= this.array.length; index++) {
                if (this.array[index] == result) {
                    this.array.splice(index, 1);
                    this.ao.splice(index, 1);
                    this.ap.splice(index, 1);
                }
            }
        }
    }

    getDetail(result : any) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(result)
            }
        }
    }

    ngOnInit(): void {}

    submit() {

        if (this.array.length > 0) {

            Swal.fire({

                title: "¿Estas Seguro?",
                text: "Agregaras Nuevos Soportes",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4BB543',
                cancelButtonColor: '#EA1737',
                confirmButtonText: 'Iniciar'

            }).then(result => {

                if (result.value) {

                    for (let index = 0; index < this.array.length; index++) {
                        
         
                        this.teso112 = new teso112(this.itemDetail.codclas, this.array[index].codsop, this.ao[index], this.ap[index]);
                        this._teso14Service.setTeso12(this.teso112).subscribe(response => {
                            if (response.status == "success") {
                                this.status = response.status;

                                this._router.navigate(['teso14']);

                            } else {
                                this.status = 'error';
                            }
                        }, error => {

                            this.status = 'error';
                            console.log(< any > error);

                        })

                    }
                    Swal.fire('Listo!', 'Soporte(s) enviados', 'success');
                } else {
                    console.log('yes');
                    Swal.fire('Cancelado!', 'Soporte(s) No Enviados', 'error');
                }
            })
        } else {
            Swal.fire({
                title: '<strong>No ha seleccionado elementos</strong>',
                icon: 'info',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> ¡Ok!',
                confirmButtonAriaLabel: '¡Ok!'
            })
        }


    }

}

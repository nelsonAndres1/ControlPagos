import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import Swal from 'sweetalert2';
import {Teso16Service} from '../services/teso16.service';
import {Teso16} from '../models/teso16';



@Component({selector: 'app-teso1116', templateUrl: './teso1116.component.html', styleUrls: ['./teso1116.component.css']})

export class Teso1116Component implements OnInit { /* public array1 = ['Revisión', 'Anulado'];
    public array2 = ['Autorizado', 'Anulado'];
    public array3 = ['Financiera','Anulado'];
    public array4  = ['Causación','Anulado'];
    public array5  = ['Causación Pago','Devuelto Radicado','Anulado'];
    public array6  = ['Revision Tesoreria','Devuelto Causación','Devuelto Radicado','Anulado'];
    public array7  = ['Radicación Pago','Devuelto Causación','Devuelto Radicado','Anulado'];
    public array8  = ['Pago Banco','Pago Portal','Devuelto Causación','Devuelto Radicado','Anulado']; */


    public estados = [
        'Administrador',
        'Radicación',
        'Revisión',
        'Autorizado',
        'Financiera',
        'Causación',
        'Causación Pago',
        'Revision Tesoreria',
        'Radicación Pago',
        'Pago'
    ];
    public teso16 : Teso16;

    itemDetail : any = [];
    array : any = [];
    status : any;
    constructor(private route : ActivatedRoute, private _route : Router, private _teso16Service : Teso16Service) {
        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
            console.log(this.itemDetail.usuario);
        })
        
    }

    ngOnInit(): void {}
    submit() {
        if (this.array.length > 0) {
            Swal.fire({
                title: "¿Estas Seguro?",
                text: "¡Agregaras Permisos a " + this.itemDetail.nombre + "!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4BB543',
                cancelButtonColor: '#EA1737',
                confirmButtonText: 'Iniciar'
            }).then(result => {
                if (result.value) {
                    for (let index = 0; index < this.array.length; index++) {
                        this._teso16Service.registerTeso16(new Teso16(this.itemDetail.usuario,this.array[index])).subscribe(response => {
                            if (response.status == "success") {
                                this.status = response.status;
                            } else {
                                this.status = 'error';
                            }
                        }, error => {
                            this.status = 'error';
                            console.log(< any > error);
                        });
                    }
                    Swal.fire('Listo!', 'Permiso(s) Agregado(s)', 'success');
                
                    this._route.navigate(['teso116']);
                    
                } else {
                    Swal.fire('Cancelado!', 'Permiso(s) No Agregado(s)', 'error');
                }
            });
        } else {
            Swal.fire('¡Error!', 'No ha seleccionado ningun permiso', 'error');
        }
    }
    onChange($event, result : any) {
        var bandera = false;
        if(result == 'Administrador'){
            result = 'AD';
        }

        if (result == 'Radicación') {
            result = 'RA';
        }
        if (result == 'Revisión') {
            result = 'RV';
        }
        if (result == 'Autorizado') {
            result = 'AU';
        }
        if (result == 'Financiera') {
            result = 'FI';
        }
        if (result == 'Causación') {
            result = 'CT';
        }
        if (result == 'Causación Pago') {
            result = 'PC';
        }
        if (result == 'Revision Tesoreria') {
            result = 'RT';
        }
        if (result == 'Radicación Pago') {
            result = 'RP';
        }
        if (result == 'Pago') {
            result = 'P';
        }

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
                        bandera = true;
                    }
                }
                if (bandera != true) {
                    this.array.push(result);

                }
            } else {
                this.array.push(result);
            }
        } else {
            for (let index = 0; index <= this.array.length; index++) {
                if (this.array[index] == result) {
                    this.array.splice(index, 1);
                }

            }
        }
    }
}

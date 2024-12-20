import { Component, OnInit, DoCheck } from '@angular/core';
import { Gener02Service } from '../services/gener02.service';
import { Teso13Service } from '../services/teso13.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css'],
    providers: [Gener02Service, Teso13Service]
})
export class PrincipalComponent implements OnInit {
    public identity;
    public token;
    public pagos: any = [];
    public pagosA: any = [];
    public pagosM: any = [];
    public pagosB: any = [];

    public pagosAA: any = [];
    public pagosMM: any = [];
    public pagosBB: any = [];

    public permisos: any;
    public arrayPermisos: any;
    constructor(public _gener02Service: Gener02Service, public _teso13Service: Teso13Service) {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this._teso13Service.getAllTeso13Pri(this.identity).subscribe(
            response => {
                this.pagos = response;
                console.log("pruebaaa");
                console.log(this.pagos);
                for (let index = 0; index < this.pagos.length; index++) {
                    this.estados(this.pagos[index].estado, this.pagos[index]);
                }
            }
        )
    }

    ngOnInit(): void {

    }
    ngDoCheck(): void {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();

    }



    estados(estado: any, pago:any) {
        var bandera: any;
        this.permisos = localStorage.getItem('permisos');
        if (this.permisos != null) {
            this.arrayPermisos = this.permisos.split(',');
            if(this.arrayPermisos.length>0){
            }else{
                this.arrayPermisos = [this.permisos]
            }
            if (estado == 'RA' || estado == 'DR') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RV' || this.arrayPermisos[index] == 'AD') {
                        
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
            if (estado == 'RV') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'AU' || this.arrayPermisos[index] == 'AD') {

                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
            if (estado == 'AU') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'FI' || this.arrayPermisos[index] == 'AD') {

                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
            if (estado == 'FI') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'CT' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
            if (estado == 'CT' || estado == 'DC') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'PC' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
            if (estado == 'PC' || estado == 'CA') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RT' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
            if (estado == 'RT') {

                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'RP' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
            if (estado == 'RP') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'P' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }

            if (estado == 'LC') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'LC' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }

            if (estado == 'CF') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'CF' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }

            if (estado == 'VF') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'VF' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }


            if (estado == 'RT') {
                for (let index = 0; index < this.arrayPermisos.length; index++) {
                    if (this.arrayPermisos[index] == 'CA' || this.arrayPermisos[index] == 'AD') {
                        if (pago.prioridad == 'ALTA') {
                            this.pagosA.push(pago);
                        }
                        if (pago.prioridad == 'MEDIA') {
                            this.pagosM.push(pago);
                        }
                        if (pago.prioridad == 'BAJA') {
                            this.pagosB.push(pago);
                        }
                    }
                }
            }
        }else{
            console.log('no hay permiso');
        }
    }






    cambioEstadoNombre(estado: any) {
        var estadoEscr

        if (estado == 'RV') {
            estadoEscr = 'Revisión';
        }
        if (estado == 'RA') {
            estadoEscr = 'Radicado';
        }
        if (estado == 'AN') {
            estadoEscr = 'Anulado';
        }
        if (estado == 'AU') {
            estadoEscr = 'Autorizado';
        }
        if (estado == 'FI') {
            estadoEscr = 'Financiera';
        }
        if (estado == 'CT') {
            estadoEscr = 'Causación de Cuenta';
        }
        if (estado == 'PC') {
            estadoEscr = 'Causación Pago';
        }
        if (estado == 'DR') {
            estadoEscr = 'Devuelto Radicado';
        }
        if (estado == 'RT') {
            estadoEscr = 'Autorización Pago';
        }
        if (estado == 'DC') {
            estadoEscr = 'Devuelto Causación';
        }
        if (estado == 'PB') {
            estadoEscr = 'Pago Banco';
        }
        if (estado == 'PP') {
            estadoEscr = 'Pago Portal';
        }
        if (estado == 'RP') {
            estadoEscr = 'Preparación Transferencia';
        }
        if (estado == 'LC') {
            estadoEscr = 'Legalización de Cheque';
        }
        if (estado == 'CF') {
            estadoEscr = 'Cheque en Firmas';
        }
        if (estado == 'CE') {
            estadoEscr = 'Cheque Entregado';
        }
        if (estado == 'VF') {
            estadoEscr = 'Verificación Estado de Transferencia';
        }
        if (estado == 'PE') {
            estadoEscr = 'Pago Exitoso';
        }
        if (estado == 'CA') {
            estadoEscr = 'Causación de Pago';
        }

        return estadoEscr;
    }

}

import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {identity, Observable, switchAll} from 'rxjs';
import Swal from 'sweetalert2';
import {Router, NavigationExtras} from '@angular/router';
/* import { ConsoleReporter } from 'jasmine'; */
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {Teso13} from '../models/teso13';
import {Teso13Service} from '../services/teso13.service';
import {Gener02Service} from '../services/gener02.service';
import {Teso10Service} from '../services/teso10.service';
import {Teso12Service} from '../services/teso12.service';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-teso13',
    templateUrl: './teso13.component.html',
    styleUrls: ['./teso13.component.css'],
    providers: [Teso13Service, Gener02Service, Teso10Service, Teso12Service]
})
export class Teso13Component implements OnInit {

    public teso13 : Teso13;
    public status : any;
    public token2 : any;
    public identity2 : any;
    public identity3 : any;
    public token : any;
    public identity : any;
    public v : any = true;
    public res : any;
    public consecutivo = '';
    public nconsecutivo : number;
    public usu : string;
    public tpago : any;
    public num : any; // consecutivo
    public usuela : any; // usuario
    public codclas : any; // codigo clase
    public periodos = [];


    constructor(private _userService : Teso13Service, private _gener02Service : Gener02Service, private _teso10Service : Teso10Service, private _teso12Service : Teso12Service, private _router : Router) {
        this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 0, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '');

        this.periodosT(2021,2025);
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.tpago = this._teso12Service.getTpago();

        this.nconsecutivo = 0;
        this.usu = '1';
        this.tpago = '1';
        this.traerConsecutivo();

    }

    ngOnInit(): void {
        this._userService.test();
    }
    periodosT(añoI:any, añoF:any){
      var resultado;
      var años=[];
      if(añoI<añoF){
        resultado = añoF-añoI;
        for (let index = 0; index < resultado; index++) {
              añoI=añoI+1;
              años.push(añoI);
        }
        for (let index = 0; index < años.length; index++) {
                for (let i = 1; i < 13; i++) {
                      if(i<10){
                        this.periodos.push(años[index]+'0'+i)
                        
                      }else{
                        this.periodos.push(años[index]+''+i);
                        
                      }     
                }
        }
      }else{
        console.log("No se puede con un año menor");
      }
      
    }

    onSubmit(form : any) {

        Swal.fire({

            title: "¿Estas Seguro?",
            text: "Iniciaras un nuevo Pago",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'

        }).then(result => {

            if (result.value) {

                this._userService.register(this.teso13).subscribe(response => {
                    if (response.status == "success") {
                        this.status = response.status;

                        var arrayD = [];
                        arrayD.push(this.num, this.tpago);

                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                result: JSON.stringify(arrayD)
                            }
                        }
                        this._router.navigate(['teso113'], navigationExtras);

                    } else {
                        this.status = 'error';
                    }
                }, error => {

                    this.status = 'error';
                    console.log(< any > error);

                });

                Swal.fire('Listo!', 'Pago Enviado', 'success');

            } else {


                Swal.fire('Cancelado!', 'Pago No Enviado', 'error');

            }
        })
    }
    download() {
        var img = new Image();
        img.src = '../../assets/logo.png';
        var doc = new jsPDF("p", "pt", "a4");
        doc.addImage(img, 40, 30, 100, 76);
        doc.setFontSize(22);
        doc.text('Reporte de Pago', 20, 20);
        doc.save('reporte_pago.pdf');
    }


    traerConsecutivo() {
        this._userService.traerConsecutivo(this.teso13).subscribe(response => {
            if (response.status != 'error') {
                this.token2 = response;
                this._userService.traerConsecutivo(this.teso13).subscribe(response => {
                    this.identity2 = response;
                    this.identity3 = response;
                    this.consecutivo = this.identity2[0]['numero'];
                    this.nconsecutivo = + this.consecutivo;
                    this.nconsecutivo = this.nconsecutivo + 1;
                    this.num = this.nconsecutivo;
                    this.teso13.numero = this.num;

                    this.usu = this.identity['sub'];
                    this.usuela = this.usu;
                    this.teso13.usuela = this.usuela;


                    this.tpago = JSON.parse(localStorage.getItem("tpa") + '');
                    this.tpago = this.tpago[0]['codclas'];
                    this.codclas = this.tpago;
                    this.teso13.codclas = this.codclas;

                    this.tpago;
                    this.nconsecutivo;
                    Object.keys(identity);

                }, error => {
                    this.status = 'error';
                    console.log(< any > error);
                });
            } else {
                this.status = 'error';
            }
        }, error => {
            this.status = 'error';
            console.log(< any > error);
        });
    }
}

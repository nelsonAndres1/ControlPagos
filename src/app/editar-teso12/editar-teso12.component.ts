import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { teso10 } from '../models/teso10';
import { Teso12Component } from '../teso12/teso12.component';
import { Teso10Service } from '../services/teso10.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Teso12Service } from '../services/teso12.service';
import { Teso13Service } from '../services/teso13.service';
import { teso12 } from '../models/teso12';
import { Teso14 } from '../models/teso14';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-editar-teso12',
  templateUrl: './editar-teso12.component.html',
  styleUrls: ['./editar-teso12.component.css'],
  providers: [Teso10Service, Teso12Service, Teso13Service]
})
export class EditarTeso12Component implements OnInit {

  formGroup: FormGroup;

  public teso10: teso10;
  public teso12: teso12;
  public status: any;
  public token: any;
  public pagos: any;
  public v: any = true;
  public res: any;
  public soporte: any = [];
  public obligatorio = '';
  public teso14: Teso14;

  opcionSeleccionado: string = '0';
  verSeleccion: string = '';
  constructor(
    public formulario: FormBuilder,
    private _teso10Service: Teso10Service,
    private _teso12Service: Teso12Service,
    private _userService: Teso13Service,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.formGroup = this.formulario.group({
      n1: [''],
      n2: [''],
    });

    this.teso10 = new teso10('', '', '', '','');
    this.teso12 = new teso12('');
    this.teso14 = new Teso14('', '', '', '', '');
    this.onSubmit();
  }

  ngOnInit(): void {
  }

  recibirTeso10() {

    console.log(this.formGroup.value);
  }

  onSubmit() {
    this._teso10Service.signup(this.teso10).subscribe(
      response => {
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;
          this._teso10Service.signup(this.teso10, this.v).subscribe(
            response => {
              this.pagos = response;
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }


  capturar() {
    this.verSeleccion = this.opcionSeleccionado;
    this.traerTpago(this.verSeleccion);
    this.delay(1000);
    this.onSubmit2(this.verSeleccion);
    return this.verSeleccion;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  editar(codclas: any, codsop: any, obliga: any) {
    Swal.fire({
      title: 'Editar soporte',
      text: "¿El soporte sera obligatorio?",
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      denyButtonText: 'No!',
    }).then((result) => {
      this.obligatorio = obliga;
      if (result.isConfirmed) {
        this.obligatorio = 'S';
        console.log("obligatorio")
        console.log(this.obligatorio);
      } else {
        console.log(" No obligatorio")
        this.obligatorio = 'N';
      }
      this.teso14.codclas = codclas;
      this.teso14.codsop = codsop;
      this.teso14.obliga = this.obligatorio;

      this._teso12Service.editarObligacionSoportes(this.teso14).subscribe(
        response => {
          if(response.status=='success'){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Actualizado correctamente!',
              showConfirmButton: false,
              timer: 1500
            })
            setTimeout(() => {
              window.location.reload();
            }, 1000); 
          }else{
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'No Actualizado!',
              showConfirmButton: false,
              timer: 1500
            })
            setTimeout(() => {
              window.location.reload();
            }, 1000); 
          }
        }
      )

    })
  }

  traerTpago(detclas: any) {
    this._userService.traerCodClas({ detclas }).subscribe(
      response => {
        if (response.status != 'error') {
          this.token = response;
          this._userService.traerCodClas({ detclas }).subscribe(
            response => {
              this.teso10.codclas = response[0].codclas;
              this._teso12Service.traerSoportesO(this.teso10).subscribe(
                response => {
                  this.soporte = response;
                  console.log(this.soporte)
                }
              )
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    )
  }

  onSubmit2(detclas: any) {
    this._teso12Service.signup({ detclas }).subscribe(
      response => {
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          this._teso12Service.signup({ detclas }, true).subscribe(
            response => {
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}

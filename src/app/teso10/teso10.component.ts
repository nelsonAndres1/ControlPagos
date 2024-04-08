import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { teso10 } from '../models/teso10';
import { Teso10Service } from '../services/teso10.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Teso12Service } from '../services/teso12.service';
import { Teso13Service } from '../services/teso13.service';
import { teso12 } from '../models/teso12';

@Component({
  selector: 'app-teso10',
  templateUrl: './teso10.component.html',
  styleUrls: ['./teso10.component.css'],
  providers: [Teso10Service, Teso12Service, Teso13Service]

})

export class Teso10Component implements OnInit {
  formGroup: UntypedFormGroup;

  public teso10: teso10;
  public teso12: teso12;
  public status: any;
  public token: any;
  public identity: any;
  public v: any = true;
  public res: any;

  opcionSeleccionado: string = '0';
  verSeleccion: string = '';

  constructor(
    public formulario: UntypedFormBuilder,
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

    this.teso10 = new teso10('', '', '', '', '', '');
    this.teso12 = new teso12('', '');
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
              this.identity = response;
              this.token;
              this.identity;
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


  capturar(e) {

    this.verSeleccion = this.opcionSeleccionado;
    this.traerTpago(e.target.value);
    this.delay(1000);
    this.onSubmit2(this.verSeleccion);
    localStorage.setItem('identity2', JSON.stringify(this.verSeleccion));
    return this.verSeleccion;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  traerTpago(detclas: any) {
    this._userService.traerCodClas({ detclas }).subscribe(
      response => {
        if (response.status != 'error') {
          this.token = response;

          this._userService.traerCodClas({ detclas }).subscribe(
            response => {
              this.identity = response;

              this.token;
              this.identity;

              localStorage.setItem('tpa', JSON.stringify(this.identity));
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
              this.identity = response;

              this.token;
              this.identity;

              localStorage.setItem('token1', this.token);
              localStorage.setItem('identity1', JSON.stringify(this.identity));

              this._router.navigate(['teso13']);
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

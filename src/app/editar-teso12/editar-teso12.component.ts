import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
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

  formGroup: UntypedFormGroup;

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
    this.teso14 = new Teso14('', '', '', '', '', '');
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


  capturar(e) {
    this.verSeleccion = this.opcionSeleccionado;
    this.traerTpago(e.target.value);
    this.delay(1000);
    this.onSubmit2(this.verSeleccion);
    return this.verSeleccion;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  editar(codclas: any, codsop: any, obliga: any, orden: any) {
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
      this.teso14.codclas = codclas;
      this.teso14.codsop = codsop;
      this.teso14.obliga = this.obligatorio;
      this.teso14.orden = orden;

      console.log("this.teso14");
      console.log(this.teso14);

      this._teso12Service.editarObligacionSoportes(this.teso14).subscribe(
        response => {
          if (response.status == 'success') {
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
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'No Actualizado!',
              showConfirmButton: false,
              timer: 1500
            })
            /* setTimeout(() => {
              window.location.reload();
            }, 1000); */
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

  async guardarCambios() {
    const cambios = this.soporte.filter(so =>
      so.obliga && so.orden !== null && so.orden !== undefined
    );

    if (cambios.length === 0) {
      Swal.fire('Sin cambios', 'No hay soportes modificados para guardar.', 'info');
      return;
    }

    Swal.fire({
      title: '¿Guardar todos los cambios?',
      text: `Se guardarán ${cambios.length} soportes.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let exitos = 0;
        let errores = 0;
        const total = cambios.length;

        this.mostrarBarraProgreso(total);

        for (let i = 0; i < total; i++) {
          const so = cambios[i];
          const teso14 = {
            codclas: so.codclas,
            codsop: so.codsop,
            obliga: so.obliga,
            orden: so.orden
          };

          try {
            const response: any = await this.enviarConEspera(teso14);
            if (response.status === 'success') {
              exitos++;
            } else {
              errores++;
            }
          } catch (err) {
            errores++;
          }

          this.actualizarBarraProgreso(i + 1, total);
          await this.esperar(1000); // espera 1 segundo
        }

        Swal.close();
        this.finalizarGuardado(exitos, errores);
      }
    });
  }

  esperar(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  finalizarGuardado(exitos: number, errores: number) {
    Swal.fire({
      title: 'Resultado del guardado',
      icon: errores === 0 ? 'success' : 'warning',
      html: `
      <p><strong>${exitos}</strong> soportes actualizados correctamente.</p>
      <p><strong>${errores}</strong> con errores.</p>
    `,
      confirmButtonText: 'Aceptar'
    }).then(() => {
      if (errores === 0) {
        window.location.reload();
      }
    });
  }

  enviarConEspera(teso14: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._teso12Service.editarObligacionSoportes(teso14).subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
  }
  mostrarBarraProgreso(total: number) {
    Swal.fire({
      title: 'Guardando cambios...',
      html: `
      <div style="margin-top: 20px;">
        <div class="progress">
          <div id="barra-progreso" class="progress-bar progress-bar-striped progress-bar-animated" 
               role="progressbar" style="width: 0%">
            0%
          </div>
        </div>
      </div>
    `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        // Nada aún, lo controlaremos manualmente
      }
    });
  }

  actualizarBarraProgreso(actual: number, total: number) {
    const porcentaje = Math.round((actual / total) * 100);
    const barra = document.getElementById("barra-progreso");
    if (barra) {
      barra.style.width = `${porcentaje}%`;
      barra.textContent = `${porcentaje}%`;
    }
  }




}

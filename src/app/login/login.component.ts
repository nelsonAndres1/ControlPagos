import { Component, OnInit } from '@angular/core';
import { Gener02 } from '../models/gener02';
import { Gener02Service } from '../services/gener02.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { PrincipalService } from '../services/principal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [Gener02Service, PrincipalService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public gener02: Gener02;
  public status: any;
  public token: any;
  public identity: any;
  public v: any = true;
  public arrayN:any = [];

  constructor(
    private _gener02Service: Gener02Service,
    private _router: Router,
    private _route: ActivatedRoute,
    private _principalService: PrincipalService
    ) {
    this.page_title = 'Identificate';
    this.gener02 = new Gener02('', '');
  }

  ngOnInit(): void {
    this.logout();
  }
  olvidoC(){
    Swal.fire('¿Olvido la Contraseña?', 'Por favor comunicarse con sistemas.','question');
  }

  
  permisos() {
    var user;
    var usuario;
    var permis;

    if (this.identity != null) {
        usuario = this.identity['sub'];
        user = usuario;
        this._principalService.permisos(new Gener02(user, '')).subscribe(response => {
            if (response.status != 'error') {
                this.status = 'success';
                //this.token = response;
                this._principalService.permisos(new Gener02(user, '')).subscribe(response => {
                    permis = response;
                    //console.log('hshshsh');
                    for (let index = 0; index < permis.length; index++) {
                      //console.log(this.permis[index]['estche']);
                      this.arrayN.push(permis[index]['estche']);
                      this.arrayN;
                    }
                    localStorage.setItem('permisos',this.arrayN);

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
    return this.arrayN;
}


  onSubmit(form: any) {
    var permisos;
    this._gener02Service.signup(this.gener02).subscribe(
      response => {
        //devuelve el token 
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;
          //objeto usuario identificado
          this._gener02Service.signup(this.gener02, this.v).subscribe(
            response => {
              this.identity = response;

              this.token
              this.identity;

              //persistir los datos del usuario
              localStorage.setItem('token',this.token);
              console.log(this.token+'asdigaidsguyasidu');
              localStorage.setItem('identity', JSON.stringify(this.identity));
              //this.permisos();
              permisos = this.permisos();
              
              //Redirección a principal
              this._router.navigate(['principal']);

            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );
        } else {
          /* this.status = 'error'; */
          Swal.fire(
            '¡Usuario o Contraseña Incorrectos!',
            'Vuelva a ingresar sus datos',
            'error'
          )
          form.reset();
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );

  }
  logout(){
    this._route.params.subscribe(
      params=>{
        let logout = +params['sure'];

        if(logout==1){
          localStorage.removeItem('identity');
          localStorage.removeItem('token');
          localStorage.removeItem('tpago');
          localStorage.removeItem('token1');
          localStorage.removeItem('tpa');
          localStorage.removeItem('identity2');
          localStorage.removeItem('identity1');
          localStorage.removeItem('permisos');

          this.identity = null;
          this.token = null;

          //Redirección a Inicio
          this._router.navigate(['login']) 
        }

      }
    );

  }

}

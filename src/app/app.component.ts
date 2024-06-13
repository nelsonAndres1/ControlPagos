import { Component, OnInit, DoCheck } from '@angular/core';
import { teso10 } from './models/teso10';
import { Gener02Service } from './services/gener02.service';
import { Teso10Service } from './services/teso10.service';
import { PrincipalService } from './services/principal.service';
import { Gener02 } from './models/gener02';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { identity } from 'rxjs';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [Gener02Service, Teso10Service, PrincipalService]
})

export class AppComponent implements OnInit,
    DoCheck {
    // Graph

    title = 'ControlPagos';
    public identity;
    public permis: any;
    public token;
    public teso10: teso10;
    public status: any;
    public v: any = true;
    public usuario: any;
    public bandera: any = true;
    public arrayN: any = [];
    public permisos: any;
    itemDetail: any = [];
    arrayPermisos: any = [];

    constructor(private route: ActivatedRoute, public _principalService: PrincipalService, public _gener02Service: Gener02Service, public _teso10Service: Teso10Service, private router: Router) {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.teso10 = new teso10('', '', '', '', '', '');

    }

    ngOnInit(): void {
        console.log("Web cargada correctamente");
    }

    inp() {
        this.router.navigate(['teso10'])
    }
    reportes() {
        this.router.navigate(['reporte'])
    }

    causadores() {
        this.router.navigate(['causadores'])
    }

    revisa() {
        this.router.navigate(['revisa_autoriza'])
    }

    inp_editar() {
        this.router.navigate(['editar_teso13'])
    }

    teso23(){
        this.router.navigate(['teso23'])
    }

    crear_opciones() {
        this.router.navigate(['teso20'])
    }
    crear_arbol() {
        this.router.navigate(['teso21'])
    }

    inp_reimprimir() {
        this.router.navigate(['teso13_reimprimir'])
    }

    vincular(){
        this.router.navigate(['teso22'])
    }

    opciones() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-warning'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Usted tiene permisos de Administrador',
            text: "¿Que opcion desea elegir?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Agregar Permisos',
            cancelButtonText: 'Eliminar Permisos',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {

                this.router.navigate(['teso116'])

            } else if (result.dismiss === Swal.DismissReason.cancel) {

                this.router.navigate(['teso1117'])

            }
        })
    }

    ngDoCheck(): void {
        this.loadUser();
        this.permisos = localStorage.getItem('permisos');
        if (this.permisos != null) {
            this.arrayPermisos = this.permisos.split(',');
        }
    }

    permisosPago() {
        var ban = false;
        for (let index = 0; index < this.arrayPermisos.length; index++) {
            if (this.arrayPermisos[index] == 'AD' || this.arrayPermisos[index] == 'RA') {
                ban = true;
                break;
            }
        }
        return ban;
    }

    permisosNuevoPago() {
        var bandera = false;
        for (let index = 0; index < this.arrayPermisos.length; index++) {
            if (this.arrayPermisos[index] == 'AD') {
                bandera = true;
                break;
            }
        }
        return bandera;
    }


    loadUser() {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
    }

    onSubmit() {
        this._teso10Service.signup(this.teso10).subscribe(response => {
            if (response.status != 'error') {
                this.status = 'success';
                this.token = response;
                this._teso10Service.signup(this.teso10, this.v).subscribe(response => {
                    this.identity = response;
                }, error => {
                    this.status = 'error';
                    console.log(<any>error);
                });
            } else {
                this.status = 'error';
            }
        }, error => {
            this.status = 'error';
            console.log(<any>error);
        });

    }
}

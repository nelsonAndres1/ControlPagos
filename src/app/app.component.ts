import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { teso10 } from './models/teso10';
import { Gener02Service } from './services/gener02.service';
import { Teso10Service } from './services/teso10.service';
import { PrincipalService } from './services/principal.service';
import { Gener02 } from './models/gener02';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppVersionService } from './services/app-version.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [Gener02Service, Teso10Service, PrincipalService, AppVersionService]
})


export class AppComponent implements OnInit, DoCheck {
    title = 'ControlPagos';

    public identity: any;
    public token: any;

    public teso10: teso10;
    public status: any;
    public v: any = true;

    public usuario: any;
    public bandera: any = true;

    /** Permisos en bruto (CSV) y como arreglo */
    private permisosRaw: string | null = null;     // valor crudo de localStorage para detectar cambios
    public arrayPermisos: string[] = [];           // e.g. ["AD", "RA", "XX"]

    /** Flags para el template (reemplazan permisosPago() / permisosNuevoPago()) */
    public canPagar = false;   // true si tiene AD o RA
    public canAdmin = false;   // true si tiene AD

    /** Otros */
    public permis: any;
    public statusMsg: any;
    public arrayN: any = [];
    public itemDetail: any = [];

    constructor(
        private ver: AppVersionService,
        private route: ActivatedRoute,
        private _principalService: PrincipalService,
        private _gener02Service: Gener02Service,
        private _teso10Service: Teso10Service,
        private router: Router
    ) {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.teso10 = new teso10('', '', '', '', '', '');

        // chequeo de versión cada 1 min (tu lógica existente)
        this.ver.init(60_000);
    }

    ngOnInit(): void {
        console.log('Web cargada correctamente');
        // Inicializa permisos al cargar
        this.refreshPermisosFromStorage();
    }

    /**
     * DoCheck: ahora es liviano. Solo reacciona si cambió el string `permisos` en localStorage.
     */
    ngDoCheck(): void {
        // refresca identity/token por si cambiaron
        this.loadUser();

        const currentRaw = localStorage.getItem('permisos');
        if (currentRaw !== this.permisosRaw) {
            // Cambió permisos en localStorage => recalcular
            this.permisosRaw = currentRaw;
            this.arrayPermisos = this.parseCsvPermisos(currentRaw);
            this.updatePermFlagsFromArray();
        }
    }

    /** Lee identity y token de tu servicio (sin cambios) */
    loadUser() {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
    }

    /** Helpers ############################# */

    /** Carga permisos desde localStorage al iniciar el componente */
    private refreshPermisosFromStorage() {
        this.permisosRaw = localStorage.getItem('permisos');
        this.arrayPermisos = this.parseCsvPermisos(this.permisosRaw);
        this.updatePermFlagsFromArray();
    }

    /** Convierte CSV a arreglo normalizado */
    private parseCsvPermisos(raw: string | null): string[] {
        if (!raw) return [];
        return raw
            .split(',')
            .map(s => (s ?? '').trim().toUpperCase())
            .filter(s => !!s); // quita vacíos
    }

    /** Actualiza flags del template a partir de arrayPermisos */
    private updatePermFlagsFromArray() {
        // canPagar: AD o RA
        const hasAD = this.arrayPermisos.includes('AD');
        const hasRA = this.arrayPermisos.includes('RA');
        this.canPagar = hasAD || hasRA;

        // canAdmin: solo AD
        this.canAdmin = hasAD;
    }

    /** Navegación ########################### */

    inp() { this.router.navigate(['teso10']); }
    reportes() { this.router.navigate(['reporte']); }
    reportesDinamicos() { this.router.navigate(['reportes_dinamicos']); }
    causadores() { this.router.navigate(['causadores']); }
    revisa() { this.router.navigate(['revisa_autoriza']); }
    inp_editar() { this.router.navigate(['editar_teso13']); }
    inp_editar_soportes() { this.router.navigate(['EditarSoportes']); }
    teso23() { this.router.navigate(['teso23']); }
    crear_opciones() { this.router.navigate(['teso20']); }
    crear_arbol() { this.router.navigate(['teso21']); }
    inp_reimprimir() { this.router.navigate(['teso13_reimprimir']); }
    vincular() { this.router.navigate(['teso22']); }
    notificaciones() { this.router.navigate(['notificaciones']); }
    pasosgenerales() { this.router.navigate(['PasosGenerales']); }
    tablero() {
        this.router.navigate(['tablero']);
    }


    opciones() {

        this.router.navigate(['teso116']);

    }

    onSubmit() {
        this._teso10Service.signup(this.teso10).subscribe(
            response => {
                if (response.status !== 'error') {
                    this.status = 'success';
                    this.token = response;

                    // segunda llamada como ya tenías
                    this._teso10Service.signup(this.teso10, this.v).subscribe(
                        resp => {
                            this.identity = resp;

                            // si el login provoca cambios de permisos en localStorage,
                            // refrescamos flags aquí también:
                            this.refreshPermisosFromStorage();
                        },
                        err => {
                            this.status = 'error';
                            console.log(err);
                        }
                    );
                } else {
                    this.status = 'error';
                }
            },
            err => {
                this.status = 'error';
                console.log(err);
            }
        );
    }
}

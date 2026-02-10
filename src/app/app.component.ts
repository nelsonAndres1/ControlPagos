import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { teso10 } from './models/teso10';
import { Gener02Service } from './services/gener02.service';
import { Teso10Service } from './services/teso10.service';
import { PrincipalService } from './services/principal.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppVersionService } from './services/app-version.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [Gener02Service, Teso10Service, PrincipalService, AppVersionService],
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
    private permisosRaw: string | null = null;
    public arrayPermisos: string[] = [];

    /** Flags para el template */
    public canPagar = false;
    public canAdmin = false;

    /** Otros */
    public permis: any;
    public statusMsg: any;
    public arrayN: any = [];
    public itemDetail: any = [];

    /** Responsive sidebar */
    public isMobile = false;
    public sidebarOpen = false;

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
        this.refreshPermisosFromStorage();
        this.setResponsiveFlags();
    }

    /** Recalcula flags al redimensionar */
    @HostListener('window:resize')
    onResize() {
        this.setResponsiveFlags();
    }

    private setResponsiveFlags() {
        this.isMobile = window.innerWidth <= 920;

        // Desktop: sidebar fijo abierto
        if (!this.isMobile) {
            this.sidebarOpen = true;
            return;
        }

        // Mobile: inicia cerrado (si ya estaba abierto por interacción, respétalo)
        // Si quieres forzar siempre cerrado al entrar, deja: this.sidebarOpen = false;
        if (this.sidebarOpen !== true) {
            this.sidebarOpen = false;
        }
    }

    toggleSidebar() {
        if (!this.isMobile) return;
        this.sidebarOpen = !this.sidebarOpen;
    }

    closeSidebar() {
        if (!this.isMobile) return;
        this.sidebarOpen = false;
    }

    onNavItemClick() {
        // Cierra al navegar en móvil
        if (this.isMobile) this.closeSidebar();
    }

    /**
     * DoCheck: ahora es liviano. Solo reacciona si cambió `permisos` en localStorage.
     */
    ngDoCheck(): void {
        // refresca identity/token por si cambiaron
        this.loadUser();

        const currentRaw = localStorage.getItem('permisos');
        if (currentRaw !== this.permisosRaw) {
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

    private refreshPermisosFromStorage() {
        this.permisosRaw = localStorage.getItem('permisos');
        this.arrayPermisos = this.parseCsvPermisos(this.permisosRaw);
        this.updatePermFlagsFromArray();
    }

    private parseCsvPermisos(raw: string | null): string[] {
        if (!raw) return [];
        return raw
            .split(',')
            .map((s) => (s ?? '').trim().toUpperCase())
            .filter((s) => !!s);
    }

    private updatePermFlagsFromArray() {
        const hasAD = this.arrayPermisos.includes('AD');
        const hasRA = this.arrayPermisos.includes('RA');
        this.canPagar = hasAD || hasRA;
        this.canAdmin = hasAD;
    }

    /** Navegación ########################### */

    inp() {
        this.router.navigate(['teso10']);
    }
    reportes() {
        this.router.navigate(['reporte']);
    }
    reportesDinamicos() {
        this.router.navigate(['reportes_dinamicos']);
    }
    causadores() {
        this.router.navigate(['causadores']);
    }
    revisa() {
        this.router.navigate(['revisa_autoriza']);
    }
    inp_editar() {
        this.router.navigate(['editar_teso13']);
    }
    inp_editar_soportes() {
        this.router.navigate(['EditarSoportes']);
    }
    teso23() {
        this.router.navigate(['teso23']);
    }
    crear_opciones() {
        this.router.navigate(['teso20']);
    }
    crear_arbol() {
        this.router.navigate(['teso21']);
    }
    inp_reimprimir() {
        this.router.navigate(['teso13_reimprimir']);
    }
    vincular() {
        this.router.navigate(['teso22']);
    }
    notificaciones() {
        this.router.navigate(['notificaciones']);
    }
    pasosgenerales() {
        this.router.navigate(['PasosGenerales']);
    }
    tablero() {
        this.router.navigate(['tablero']);
    }
    opciones() {
        this.router.navigate(['teso116']);
    }
    asopotes() {
        this.router.navigate(['soportes_administrador']);
    }

    onSubmit() {
        this._teso10Service.signup(this.teso10).subscribe(
            (response) => {
                if (response.status !== 'error') {
                    this.status = 'success';
                    this.token = response;

                    this._teso10Service.signup(this.teso10, this.v).subscribe(
                        (resp) => {
                            this.identity = resp;

                            // si el login provoca cambios de permisos en localStorage
                            this.refreshPermisosFromStorage();
                        },
                        (err) => {
                            this.status = 'error';
                            console.log(err);
                        }
                    );
                } else {
                    this.status = 'error';
                }
            },
            (err) => {
                this.status = 'error';
                console.log(err);
            }
        );
    }
}

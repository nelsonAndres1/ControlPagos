import { Component, OnInit, DoCheck, HostListener, OnDestroy } from '@angular/core';
import { teso10 } from './models/teso10';
import { Gener02Service } from './services/gener02.service';
import { Teso10Service } from './services/teso10.service';
import { PrincipalService } from './services/principal.service';
import { Router } from '@angular/router';
import { AppVersionService } from './services/app-version.service';
import { TesoChatService } from './services/tesochat.service';
import { MenuAccessService } from './services/menu-access.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [Gener02Service, Teso10Service, PrincipalService, AppVersionService],
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {
    title = 'ControlPagos';
    public chatUnread: number = 0;
    private chatTimer: any = null;
    public identity: any;
    public token: any;

    public teso10: teso10;
    public status: any;
    public v: any = true;

    public usuario: any;
    public bandera: any = true;

    private permisosRaw: string | null = null;
    public arrayPermisos: string[] = [];

    private menuAccessRaw: string | null = null;
    public menuOptionKeys: string[] = [];
    public roleCodes: string[] = [];

    public permis: any;
    public statusMsg: any;
    public arrayN: any = [];
    public itemDetail: any = [];

    public isMobile = false;
    public sidebarOpen = false;
    public isAuthRoute = false;

    constructor(
        private ver: AppVersionService,
        private _principalService: PrincipalService,
        private _gener02Service: Gener02Service,
        private _teso10Service: Teso10Service,
        private _chatService: TesoChatService,
        private _menuAccessService: MenuAccessService,
        private router: Router
    ) {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.teso10 = new teso10('', '', '', '', '', '');
        this.ver.init(60_000);
    }

    ngOnInit(): void {
        console.log('Web cargada correctamente');
        this.updateRouteFlags();
        this.refreshPermisosFromStorage();
        this.refreshMenuAccessFromStorage();
        if (this.identity && this.menuOptionKeys.length === 0) {
            this._menuAccessService.loadProfile(this.identity.sub).subscribe({
                next: () => this.refreshMenuAccessFromStorage(),
                error: () => {
                    this._menuAccessService.setFallbackProfile(this.identity.sub);
                    this.refreshMenuAccessFromStorage();
                }
            });
        }
        this.setResponsiveFlags();
        this.startChatUnreadPolling();
    }

    ngOnDestroy(): void {
        if (this.chatTimer) clearInterval(this.chatTimer);
    }

    @HostListener('window:resize')
    onResize() {
        this.setResponsiveFlags();
    }

    private setResponsiveFlags() {
        this.isMobile = window.innerWidth <= 920;

        if (!this.isMobile) {
            this.sidebarOpen = true;
            return;
        }

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
        if (this.isMobile) this.closeSidebar();
    }

    ngDoCheck(): void {
        this.loadUser();
        this.updateRouteFlags();

        const currentRaw = localStorage.getItem('permisos');
        if (currentRaw !== this.permisosRaw) {
            this.permisosRaw = currentRaw;
            this.arrayPermisos = this.parseCsvPermisos(currentRaw);
        }

        const currentMenuRaw = localStorage.getItem('menuAccessControlPagos');
        if (currentMenuRaw !== this.menuAccessRaw) {
            this.refreshMenuAccessFromStorage();
        }

        const hasIdentity = !!this.identity;
        if (!hasIdentity) {
            this.chatUnread = 0;
            if (this.chatTimer) {
                clearInterval(this.chatTimer);
                this.chatTimer = null;
            }
        } else if (!this.chatTimer) {
            this.startChatUnreadPolling();
        }
    }

    private updateRouteFlags() {
        const currentUrl = this.router.url || '';
        this.isAuthRoute = currentUrl.startsWith('/login') || currentUrl.startsWith('/logout') || currentUrl === '/';
    }

    loadUser() {
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
    }

    private refreshPermisosFromStorage() {
        this.permisosRaw = localStorage.getItem('permisos');
        this.arrayPermisos = this.parseCsvPermisos(this.permisosRaw);
    }

    private refreshMenuAccessFromStorage() {
        this.menuAccessRaw = localStorage.getItem('menuAccessControlPagos');
        this.menuOptionKeys = this._menuAccessService.getOptionKeys();
        this.roleCodes = this._menuAccessService.getRoleCodes();
    }

    private parseCsvPermisos(raw: string | null): string[] {
        if (!raw) return [];
        return raw
            .split(',')
            .map((s) => (s ?? '').trim().toUpperCase())
            .filter((s) => !!s);
    }

    public hasMenu(optionKey: string): boolean {
        return this.menuOptionKeys.includes(optionKey);
    }

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

    historial_cambios() {
        this.router.navigate(['teso13_cambios']);
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
        this.router.navigate(['menu-roles']);
    }

    asopotes() {
        this.router.navigate(['soportes_administrador']);
    }

    ChatList() {
        this.router.navigate(['ChatList']);
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
                            this.refreshPermisosFromStorage();
                            this.refreshMenuAccessFromStorage();
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

    startChatUnreadPolling() {
        if (this.chatTimer) clearInterval(this.chatTimer);
        if (!this.identity) return;

        this.refreshChatUnread();
        this.chatTimer = setInterval(() => {
            if (!this.identity) return;
            this.refreshChatUnread();
        }, 15000);
    }

    refreshChatUnread() {
        this._chatService.getUnreadSummary().subscribe({
            next: (resp) => {
                if (resp?.status === 'success') {
                    this.chatUnread = Number(resp.data?.total_unread || 0);
                }
            },
            error: () => { }
        });
    }
}

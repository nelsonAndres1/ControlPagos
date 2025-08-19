import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, NavigationExtras } from '@angular/router';
import { Teso13 } from '../models/teso13';
import { Teso13Service } from '../services/teso13.service';
import { Gener02Service } from '../services/gener02.service';
import { Teso10Service } from '../services/teso10.service';
import { Teso12Service } from '../services/teso12.service';
import jsPDF from 'jspdf';
import { Teso17 } from '../models/teso17';
import { Conta71 } from '../models/conta71';
import { UtilidadesService } from '../services/utilidades.service';
import { Teso19Service } from '../services/teso19.service';
import { Numfac } from '../models/numfac';

@Component({
    selector: 'app-teso13',
    templateUrl: './teso13.component.html',
    styleUrls: ['./teso13.component.css'],
    providers: [Teso13Service, Gener02Service, Teso10Service, Teso12Service, UtilidadesService, Teso19Service]
})
export class Teso13Component implements OnInit {

    bandera_loading = false;
    // Usaremos "any" para no modificar el modelo Teso13 y poder setear centros_json dinámicamente
    teso13: any;
    status: 'success' | 'error' | undefined;
    token: any;
    identity: any;
    consecutivo = '';
    nconsecutivo = 0;
    usu = '';
    tpago: any;
    num: any;
    usuela: any;
    codclas: any;
    periodos: string[] = [];
    valor: any;

    // NIT
    datac2: any;
    bandera2 = false;
    nit_nombre: any;

    // Personas
    personas_revisa: any[] = [];
    personas_autoriza: any[] = [];

    // Info pagos
    data_cant_pagos = '';
    datos_teso17: any = [];
    cuota: any;

    // CDP
    marca: string[] = ['AC', 'OP', 'SU'];
    cdp_marca: any;
    cdp_documento: any;
    cdp_ano: any;
    nit: any;
    siCDPno = false;
    cdp_bandera = false;

    // Soportes / fecha
    datoSoportes: any;
    fechaRdicado: any = '';
    bd1 = true;

    // ===== Subdirección (single) =====
    subdir_nombre = '';
    dataSubdir: any[] = [];
    banderaSubdir = false;
    subdir_locked = false;  // si quieres bloquear tras elegir

    // ===== Dependencia (single) =====
    dep_nombre = '';
    datac28: any;
    bandera28 = false;
    dep_locked = false;

    // ===== Centro de Costo (varios) =====
    ccVarios = false;
    cc_nombre = '';
    dataCC: any[] = [];
    banderaCC = false;
    cc_actual_cod = '';
    cc_actual_detalle = '';
    centros: Array<{ codcen: string; detalleCC: string; }> = [];

    // Reuso
    data: any; // no lo usamos ahora para subdir/cc (mantenido por compatibilidad)
    data71: any;
    data_keyword: any = { data: '', codcen: '' };
    numfac: Numfac;

    nombre_usuario: string = '';
    nombre_pago: string = '';

    constructor(
        private _teso13Service: Teso13Service,
        private _gener02Service: Gener02Service,
        private _teso10Service: Teso10Service,
        private _teso12Service: Teso12Service,
        private _router: Router,
        private _utilidadesService: UtilidadesService,
        private _teso19Service: Teso19Service
    ) {
        this.numfac = new Numfac('');
        this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', null, '', '', '0', '', '', '', '');
        this.teso13.centros_json = ''; // campo dinámico (sin modificar el modelo)

        // Periodos del año actual
        const currentYear = new Date().getFullYear();
        this.periodosT(currentYear, currentYear);

        // Identidad / usuario //
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.usu = this.identity?.sub || this.identity?.usuario || this.identity?.username || '';
        this.teso13.usuela = this.usu;

        // Tipo de pago / codclas //
        try {
            const raw = localStorage.getItem('tpa');
            const tpa = raw ? JSON.parse(raw) : null;
            this.tpago = Array.isArray(tpa) ? tpa[0]?.codclas : (tpa?.codclas ?? tpa ?? '');
        } catch { this.tpago = ''; }
        this.codclas = this.tpago;
        this.teso13.codclas = this.codclas;

        // Fecha de radicado
        this._teso13Service.fecha().subscribe(response => { this.fechaRdicado = response; });

        // Soportes
        try {
            const raw = localStorage.getItem('identity1');
            this.datoSoportes = raw ? JSON.parse(raw) : [];
        } catch { this.datoSoportes = []; }

        if (!Array.isArray(this.datoSoportes) || this.datoSoportes.length === 0) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No existen soportes asociados al tipo de pago!' });
            this._router.navigate(['teso10']);
        }

        // Listas de personas
        this._utilidadesService.getAutorizaRevisa({ 'opcion': 'REVISA' }).subscribe(r => this.personas_revisa = r || []);
        this._utilidadesService.getAutorizaRevisa({ 'opcion': 'AUTORIZA' }).subscribe(r => this.personas_autoriza = r || []);
        this.getUsuario();
        this.getFirstPago();
    }

    ngOnInit(): void { this._teso13Service.test(); }

    // ===== UI helpers =====
    CDP() { this.cdp_bandera = !this.cdp_bandera; }

    toggleCCVarios() {
        this.ccVarios = !this.ccVarios;
        // No borramos lo agregado; solo deshabilitamos agregar más si está apagado.
    }

    // ===== NIT =====
    touch(resultC: any) {
        this._teso19Service.getAllPagos(resultC).subscribe(response => {
            this.data_cant_pagos = 'Este Nit tiene esta cantidad de pagos: ' + (response?.total_pagos ?? 0);
        });
        this.teso13.nit = resultC.nit;
        this.nit_nombre = resultC.razsoc;
        this.bandera2 = false;
    }

    // ===== SUBDIRECCIÓN (single) =====

    buscarSubdir(e: any) {
        this.bandera_loading = true;
        const keyword = e.target.value;

        this._teso13Service.getConta06(keyword).then(
            (r: unknown) => {
                this.bandera_loading = false;
                // Si la API retorna un array directo
                if (Array.isArray(r)) {
                    this.dataSubdir = r;
                }
                // Si la API retorna un objeto con la lista adentro (por ejemplo { data: [...] })
                else if (r && typeof r === 'object' && Array.isArray((r as any).data)) {
                    this.dataSubdir = (r as any).data;
                }
                else {
                    this.dataSubdir = [];
                }
                this.banderaSubdir = true;
            },
            _ => { this.bandera_loading = false; }
        );
    }

    touchSubdir(r: any) {
        // setea subdirección (usa teso13.codcen como antes)
        this.teso13.codcen = r.codcen;
        this.subdir_nombre = r.detalle;
        this.banderaSubdir = false;

        // al elegir subdirección, limpia dependencia para forzar selección válida
        this.teso13.coddep = '';
        this.dep_nombre = '';
        this.dep_locked = false;
    }

    // ===== DEPENDENCIA (single) =====
    buscarDep(e: any) {
        this.data_keyword = { data: e.target.value, codcen: this.teso13.codcen }; // filtra por subdirección elegida
        this._teso13Service.getConta28(this.data_keyword).subscribe(
            r => { this.datac28 = r || []; this.bandera28 = true; }
        );
    }

    touchDep(r2: any) {
        this.teso13.coddep = r2.coddep;
        this.dep_nombre = r2.detalle;
        this.bandera28 = false;
        // si quieres bloquear la edición tras elegir:
        // this.dep_locked = true;
    }

    // ===== CENTRO DE COSTO (varios) =====
    // En el componente


    buscarCC(e: any) {
        this.bandera_loading = true;
        const keyword = e.target.value;

        this._teso13Service.getConta06(keyword).then(
            (r: any[] | null) => {
                this.bandera_loading = false;
                this.dataCC = r ?? [];   // si viene null o undefined, queda []
                this.banderaCC = true;
            },
            _ => this.bandera_loading = false
        );
    }


    touchCCVarios(rc: any) {
        this.cc_actual_cod = rc.codcen;
        this.cc_actual_detalle = rc.detalle;
        this.banderaCC = false;
    }

    addCentro() {
        if (!this.ccVarios) return;
        const cod = (this.cc_actual_cod || '').trim();
        if (!cod) {
            Swal.fire('Faltan datos', 'Selecciona un Centro de Costo de la lista.', 'warning');
            return;
        }
        const dup = this.centros.some(c => c.codcen === cod);
        if (dup) {
            Swal.fire('Duplicado', 'Ese Centro de Costo ya fue agregado.', 'info');
            return;
        }
        this.centros.push({ codcen: cod, detalleCC: this.cc_actual_detalle || '' });
        // limpiar selección actual
        this.cc_actual_cod = '';
        this.cc_actual_detalle = '';
        this.cc_nombre = '';
    }

    removeCentro(i: number) { this.centros.splice(i, 1); }

    // ===== Otras búsquedas reusadas =====
    getConta04(e: any) {
        this.bandera_loading = true;
        const keyword = e.target.value;
        this._teso13Service.getConta04(keyword).then(
            r => { this.bandera_loading = false; this.datac2 = r; this.bandera2 = true; },
            _ => this.bandera_loading = false
        );
    }

    getUsuario() {
        this._gener02Service.getUsuario({ usuper: this.usu }).subscribe(
            response => { this.nombre_usuario = response.nombre; },
            _ => Swal.fire('Error', 'Error al obtener el usuario', 'error')
        );
    }

    getFirstPago() {
        this._teso10Service.getFirstPago(this.teso13).subscribe(
            response => { this.nombre_pago = response.data.detclas; },
            _ => { Swal.fire('Error', 'Error al obtener el primer pago', 'error'); }
        );
    }

    getDetailPage(_r: any) { }
    getDetailPageC2(_r: any) { }
    getDetailPageC28(_r: any) { }
    getC71(marca: string, documento: any) {
        const keyword = [marca, documento];
        this._teso13Service.getC71(keyword).then(r => this.data71 = r);
    }
    getDetailPageC71(_r: any) { }

    // ===== Lógica previa existente =====
    periodosT(añoI: number, añoF: number) {
        if (añoI > añoF) { console.log('No se puede con un año menor'); return; }
        for (let y = añoI; y <= añoF; y++) {
            for (let m = 1; m <= 12; m++) {
                this.periodos.push(`${y}${m < 10 ? '0' + m : m}`);
            }
        }
    }

    buscarT17(cdp_marca: any, cdp_documento: string, cdp_ano: any, nit: any) {
        this._teso13Service.getbusqueda71(new Conta71(cdp_marca, cdp_documento, cdp_ano, nit)).subscribe(response => {
            if (response) {
                this.cdp_marca = cdp_marca; this.cdp_documento = cdp_documento; this.cdp_ano = cdp_ano; this.nit = nit;
                this._teso13Service.getTeso17(new Teso17(nit, cdp_marca, cdp_documento, cdp_ano, '', '', 0, 0, '')).subscribe(
                    r => {
                        this.siCDPno = true; this.bd1 = true;
                        if (r.numcuo == r.cuota) {
                            if (r.numcuo == undefined) { this.teso13.numcuo = 1; this.cuota = 1; }
                            else { Swal.fire('Información', 'Ya se han realizado la totalidad de los pagos', 'info'); this.teso13.numcuo = 1; this.cuota = 1; }
                        } else {
                            this.datos_teso17.push(r.numcuo, r.cuota);
                            this.teso13.numcuo = r.numcuo; this.cuota = parseInt(r.cuota) + 1;
                        }
                    },
                    _ => { this.bd1 = false; }
                );
            } else {
                this.bd1 = false;
                Swal.fire('¡Error!', 'No existen datos asociados a CDP Y NIT!', 'error');
            }
        });
    }

    private normalizeCurrency(value: string): number {
        if (!value) return 0;
        const sinPuntos = value.replace(/\./g, '');
        const conPuntoDecimal = sinPuntos.replace(',', '.');
        const n = Number(conPuntoDecimal);
        return isNaN(n) ? 0 : n;
    }

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value || '';
        value = value.replace(/\./g, '');
        value = value.replace(/[^0-9,]/g, '');
        const [integerPart, decimalPart] = value.split(',');
        const formattedIntegerPart = (integerPart || '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        input.value = decimalPart !== undefined ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
        this.teso13.valor = input.value;
    }

    onSubmit(form: any) {
        Swal.fire({
            title: '¿Estas Seguro?',
            text: 'Iniciaras un nuevo Pago',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'
        }).then(result => {
            this.teso13.fecrad = this.fechaRdicado;
            if ((this.teso13.numcon + '').trim() === '') this.teso13.numcon = '0';
            if (!result.value) { Swal.fire('Cancelado!', 'Pago No Enviado', 'error'); return; }

            const valorNum = this.normalizeCurrency(this.teso13.valor);

            // Token de upload
            const uploadToken = (window as any).crypto?.randomUUID?.() || String(Date.now());
            this.teso13.upload_token = uploadToken; // si tu modelo no lo tiene, es campo dinámico

            // Empaquetar CC varios en JSON (único sitio donde se usa para backend)
            this.teso13.centros_json = JSON.stringify(this.centros || []);

            const navegar = () => {
                const arrayD = [
                    this.tpago,
                    this.nit_nombre,
                    this.subdir_nombre,  // solo informativo
                    this.dep_nombre,     // solo informativo
                    this.siCDPno ? this.cdp_marca : 'OP',
                    this.siCDPno ? this.cdp_documento : '00',
                    this.siCDPno ? this.cdp_ano : '0',
                    this.teso13.nit
                ];

                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        result: JSON.stringify([this.teso13, arrayD]),
                        uploadToken
                    }
                };

                this._router.navigate(['teso12_upload'], navigationExtras);
                Swal.fire('Formulario diligenciado!', 'Pendiente envio!', 'success');
            };

            if (this.siCDPno) {
                this.teso13.sCDPn = true;
                this._teso13Service
                    .valorCDP(new Conta71(this.cdp_marca, this.cdp_documento, this.cdp_ano, this.nit))
                    .subscribe(response => {
                        const valorCDP = Number(response) || 0;
                        if (valorCDP >= valorNum) navegar();
                        else Swal.fire('Error!', 'Pago No Enviado, valor de CDP insuficiente', 'error');
                    });
            } else {
                this.teso13.sCDPn = false;
                this.teso13.cdp_ano = '0';
                this.teso13.cdp_documento = '00';
                this.teso13.cdp_marca = 'OP';
                navegar();
            }
        });
    }

    download() {
        const img = new Image();
        img.src = '../../assets/logo.png';
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.addImage(img, 40, 30, 100, 76);
        doc.setFontSize(22);
        doc.text('Reporte de Pago', 20, 20);
        doc.save('reporte_pago.pdf');
    }

    traerConsecutivo() {
        try {
            const raw = localStorage.getItem('tpa');
            this.tpago = raw ? JSON.parse(raw) : null;
            this.tpago = Array.isArray(this.tpago) ? this.tpago[0]['codclas'] : this.tpago;
        } catch { this.tpago = null; }
        this.codclas = this.tpago;
        this.teso13.codclas = this.codclas;
    }

    verificarNumero(event: any) {
        this.bandera_loading = true;
        this.numfac = new Numfac(event.target.value);
        this._teso13Service.verificarNumero(this.numfac).subscribe(
            response => {
                this.bandera_loading = false;
                if (response.status === 'success' && response.bandera === '1') {
                    Swal.fire('Información', 'Este numero de factura ya existe en un pago!');
                }
            },
            _ => { this.bandera_loading = false; }
        );
    }
}

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

    teso13: Teso13;
    status: 'success' | 'error' | undefined;

    token: any;
    identity: any;

    // Consecutivo solo informativo (lo asigna backend en register)
    consecutivo = '';
    nconsecutivo = 0; // CHG: queda 0/ vacío hasta que backend asigne

    usu = '';
    tpago: any;

    // Mantengo los nombres originales de tus flags/props
    num: any;            // CHG: ya no se usa para enviar
    usuela: any;
    codclas: any;

    periodos: string[] = [];

    data: any;
    datac2: any;
    datac28: any;

    valor: any;

    bandera = false;
    bandera2 = false;
    bandera28 = false;

    nit_nombre: any;
    codcen_nombre: any;
    coddep_nombre: any;

    marca: string[] = ['AC', 'OP', 'SU'];

    data71: any;
    datos_teso17: any = [];
    cuota: any;

    cdp_marca: any;
    cdp_documento: any;
    cdp_ano: any;
    nit: any;

    bd1 = true;
    siCDPno = false;

    valor_CDP: any;
    valor_a: any;

    datoSoportes: any;

    fechaRdicado: any = '';

    centroCostos = false;
    cdp_bandera = false;

    personas_revisa: any[] = [];
    personas_autoriza: any[] = [];

    data_cant_pagos = '';
    data_keyword: any = { data: '', codcen: '' };

    numfac: Numfac;

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
        this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', null, '', '', '0', '', '', '', ''); // asegúrate que tu modelo tenga upload_token

        // Periodos del año actual
        const currentYear = new Date().getFullYear();
        this.periodosT(currentYear, currentYear);

        // Identidad / usuario // CHG: setear aquí (antes estaba en traerConsecutivo)
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.usu = this.identity?.sub || this.identity?.usuario || this.identity?.username || '';
        this.teso13.usuela = this.usu;

        // Tipo de pago / codclas // CHG: setear aquí
        try {
            const raw = localStorage.getItem('tpa');
            const tpa = raw ? JSON.parse(raw) : null;
            this.tpago = Array.isArray(tpa) ? tpa[0]?.codclas : (tpa?.codclas ?? tpa ?? '');
        } catch { this.tpago = ''; }
        this.codclas = this.tpago;
        this.teso13.codclas = this.codclas;

        // Fecha de radicado
        this._teso13Service.fecha().subscribe(response => { this.fechaRdicado = response; });

        // ❌ CHG: NO pedir consecutivo al cargar (lo asigna backend al guardar)
        // this.traerConsecutivo();

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
    }

    ngOnInit(): void { this._teso13Service.test(); }

    // UI helpers
    CDP() { this.cdp_bandera = !this.cdp_bandera; }
    centroC() { this.centroCostos = !this.centroCostos; }

    touch(resultC: any) {
        this._teso19Service.getAllPagos(resultC).subscribe(response => {
            this.data_cant_pagos = 'Este Nit tiene esta cantidad de pagos: ' + (response?.total_pagos ?? 0);
        });
        this.teso13.nit = resultC.nit;
        this.nit_nombre = resultC.razsoc;
        this.bandera2 = false;
    }
    touchCC(result: any) { this.teso13.codcen = result.codcen; this.codcen_nombre = result.detalle; this.bandera = false; }
    touch28(result: any) { this.teso13.coddep = result.coddep; this.coddep_nombre = result.detalle; this.bandera28 = false; }

    // Búsquedas
    getConta(e: any) {
        this.bandera_loading = true;
        const keyword = e.target.value;
        this._teso13Service.getConta06(keyword).then(
            r => { this.bandera_loading = false; this.data = r; this.bandera = true; },
            _ => this.bandera_loading = false
        );
    }
    getConta28(e: any) {
        this.data_keyword = { data: e.target.value, codcen: this.teso13.codcen };
        this._teso13Service.getConta28(this.data_keyword).subscribe(r => { this.datac28 = r; this.bandera28 = true; });
    }
    getConta04(e: any) {
        this.bandera_loading = true;
        const keyword = e.target.value;
        this._teso13Service.getConta04(keyword).then(
            r => { this.bandera_loading = false; this.datac2 = r; this.bandera2 = true; },
            _ => this.bandera_loading = false
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

    // Lógica
    periodosT(añoI: number, añoF: number) {
        if (añoI > añoF) { console.log('No se puede con un año menor'); return; }
        for (let y = añoI; y <= añoF; y++) for (let m = 1; m <= 12; m++) this.periodos.push(`${y}${m < 10 ? '0' + m : m}`);
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

            // Generar token y llevarlo a la siguiente pantalla (y en el payload)
            const uploadToken = (window as any).crypto?.randomUUID?.() || String(Date.now());
            this.teso13.upload_token = uploadToken;

            const navegar = () => {
                // NO incluir consecutivo; el backend lo asigna
                const arrayD = [
                    this.tpago,
                    this.nit_nombre,
                    this.codcen_nombre,
                    this.coddep_nombre,
                    this.siCDPno ? this.cdp_marca : 'OP',
                    this.siCDPno ? this.cdp_documento : '00',
                    this.siCDPno ? this.cdp_ano : '0',
                    this.teso13.nit
                ];

                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        result: JSON.stringify([this.teso13, arrayD]),
                        uploadToken // <-- SIEMPRE por query param
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

    // CHG: dejar traerConsecutivo solo para setear codclas desde localStorage si quieres,
    // pero NO llamar backend ni asignar numero en el front.
    traerConsecutivo() {
        try {
            const raw = localStorage.getItem('tpa');
            this.tpago = raw ? JSON.parse(raw) : null;
            this.tpago = Array.isArray(this.tpago) ? this.tpago[0]['codclas'] : this.tpago;
        } catch { this.tpago = null; }
        this.codclas = this.tpago;
        this.teso13.codclas = this.codclas;

        /* ❌ Ya no se usa para traer numero
        this._teso13Service.traerConsecutivo(this.teso13)...
        */
    }

    verificarNumero(event: any) {
        this.bandera_loading = true;
        this.numfac.numfac = event.target.value;
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

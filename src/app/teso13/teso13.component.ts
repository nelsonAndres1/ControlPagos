// teso13.component.ts

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

    // Usamos any para setear campos dinámicos (centros_json, cdps_json, upload_token) sin tocar el modelo
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

    // Compat (campos simples históricos)
    cdp_marca: any;
    cdp_documento: any;
    cdp_ano: any;
    nit: any;

    siCDPno = false;
    cdp_bandera = false;

    // ===== CDP (VARIOS) =====
    cdp_actual_marca: string = 'AC';
    cdp_actual_documento: string = '';
    cdp_actual_ano: any = ''; // input number puede ser number o string
    cdps: Array<{ marca: string; documento: string; ano: number }> = [];

    // Soportes / fecha
    datoSoportes: any;
    fechaRdicado: any = '';
    bd1 = true;

    // ===== Subdirección (single) =====
    subdir_nombre = '';
    dataSubdir: any[] = [];
    banderaSubdir = false;
    subdir_locked = false;

    // ===== Dependencia (single) =====
    dep_nombre = '';
    datac28: any;
    bandera28 = false;
    dep_locked = false;

    // ===== Centro de Costo (varios) =====
    ccVarios = true;
    cc_nombre = '';
    dataCC: any[] = [];
    banderaCC = false;
    cc_actual_cod = '';
    cc_actual_detalle = '';
    centros: Array<{ codcen: string; detalleCC: string; }> = [];

    // Reuso
    data: any;
    data71: any;
    data_keyword: any = { data: '', codcen: '' };
    numfac: Numfac;

    nombre_usuario: string = '';
    nombre_pago: string = '';

    // ===== Control por “SIN CDP” / búsqueda obligatoria =====
    sinCDPChecked = false;
    requiereBusqueda = true;
    busquedaOk = false;

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

        this.teso13 = new Teso13(
            '', '', '', '', '', '', '', '', '',
            1, '', '', '', '', '', '', '', '', '', '', '',
            0, 0, 0, '', '', '', '', null, '', '', '0', '', '', '', ''
        );

        // Campos dinámicos
        this.teso13.centros_json = '';
        this.teso13.cdps_json = '';

        // Periodos del año actual
        const currentYear = new Date().getFullYear();
        this.periodosT(currentYear, currentYear);

        // Identidad / usuario
        this.identity = this._gener02Service.getIdentity();
        this.token = this._gener02Service.getToken();
        this.usu = this.identity?.sub || this.identity?.usuario || this.identity?.username || '';
        this.teso13.usuela = this.usu;

        // Tipo de pago / codclas
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

    // ===== UX NO TRAUMÁTICA: Enter agrega CDP =====
    onEnterAddCDP(ev: any) {
        if (ev?.preventDefault) ev.preventDefault();
        this.addCDP();
    }


    // ===== Sync CDPs a JSON para backend =====
    private syncCdpsJson() {
        // Si SIN CDP, vacío
        if (this.sinCDPChecked) {
            this.teso13.cdps_json = '';
            return;
        }
        this.teso13.cdps_json = JSON.stringify(this.cdps || []);
    }

    // ===== Auto-agregar si el CDP está completo (para evitar “trauma”) =====
    autoAddCDPIfComplete() {
        if (this.sinCDPChecked) return;

        const marca = String(this.cdp_actual_marca ?? '').trim();
        const documento = String(this.cdp_actual_documento ?? '').trim();
        const anoStr = String(this.cdp_actual_ano ?? '').trim();

        // Si no está completo, no hacemos nada
        if (!marca || !documento || !anoStr) return;

        // Si está completo, lo intentamos agregar (respeta duplicados y validaciones)
        this.addCDP(false); // false = no mostrar alertas por faltantes (ya está completo)
    }

    // ===== Manejo del check ¿SIN CDP? =====
    onSinCDPChange(e: any) {
        this.sinCDPChecked = !!e?.target?.checked;

        if (this.sinCDPChecked) {
            // SIN CDP: habilitar todo y no exigir búsqueda
            this.requiereBusqueda = false;
            this.busquedaOk = true;

            // Limpia CDPs agregados
            this.cdps = [];
            this.syncCdpsJson();

            // Defaults (para backend / compatibilidad)
            this.teso13.cdp_marca = 'OP';
            this.teso13.cdp_documento = '00';
            this.teso13.cdp_ano = 0; // si backend espera integer, mejor number aquí

            this.siCDPno = false;

            // limpiar inputs CDP actual
            this.cdp_actual_marca = 'AC';
            this.cdp_actual_documento = '';
            this.cdp_actual_ano = '';
        } else {
            // Con CDP: exigir búsqueda para continuar
            this.requiereBusqueda = true;
            this.busquedaOk = false;
            this.siCDPno = false;
        }
    }

    toggleCCVarios() {
        this.ccVarios = !this.ccVarios;
    }

    // ===== CDP (varios) =====
    addCDP(mostrarAlertasPorFaltantes: boolean = true) {
        if (this.sinCDPChecked) return;

        const marca = String(this.cdp_actual_marca ?? '').trim();
        const documento = String(this.cdp_actual_documento ?? '').trim();
        const anoStr = String(this.cdp_actual_ano ?? '').trim();
        const anoNum = Number(anoStr);

        if (!marca || !documento || !anoStr) {
            if (mostrarAlertasPorFaltantes) {
                Swal.fire('Faltan datos', 'Diligencia Marca, Documento y Año del CDP.', 'warning');
            }
            return;
        }

        if (!Number.isFinite(anoNum) || anoNum <= 0) {
            Swal.fire('Año inválido', 'El año del CDP debe ser numérico.', 'warning');
            return;
        }

        const dup = this.cdps.some(x =>
            x.marca === marca &&
            x.documento === documento &&
            x.ano === anoNum
        );

        if (dup) {
            Swal.fire('Duplicado', 'Ese CDP ya fue agregado.', 'info');
            return;
        }

        this.cdps.push({ marca, documento, ano: anoNum });
        this.syncCdpsJson();

        // limpiar inputs
        this.cdp_actual_documento = '';
        this.cdp_actual_ano = '';
    }

    removeCDP(i: number) {
        this.cdps.splice(i, 1);
        this.syncCdpsJson();
    }

    private nitParam(nit: any): any {
        const s = String(nit ?? '').trim();
        const n = Number(s);
        return (s !== '' && Number.isFinite(n)) ? n : s;
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
                if (Array.isArray(r)) {
                    this.dataSubdir = r;
                } else if (r && typeof r === 'object' && Array.isArray((r as any).data)) {
                    this.dataSubdir = (r as any).data;
                } else {
                    this.dataSubdir = [];
                }
                this.banderaSubdir = true;
            },
            _ => { this.bandera_loading = false; }
        );
    }

    touchSubdir(r: any) {
        this.teso13.codcen = r.codcen;
        this.subdir_nombre = r.detalle;
        this.banderaSubdir = false;

        // al elegir subdirección, limpia dependencia
        this.teso13.coddep = '';
        this.dep_nombre = '';
        this.dep_locked = false;
    }

    // ===== DEPENDENCIA (single) =====
    buscarDep(e: any) {
        this.data_keyword = { data: e.target.value, codcen: this.teso13.codcen };
        this._teso13Service.getConta28(this.data_keyword).subscribe(
            r => { this.datac28 = r || []; this.bandera28 = true; }
        );
    }

    touchDep(r2: any) {
        this.teso13.coddep = r2.coddep;
        this.dep_nombre = r2.detalle;
        this.bandera28 = false;
    }

    // ===== CENTRO DE COSTO (varios) =====
    buscarCC(e: any) {
        this.bandera_loading = true;
        const keyword = e.target.value;

        this._teso13Service.getConta06(keyword).then(
            (r: any[] | null) => {
                this.bandera_loading = false;
                this.dataCC = r ?? [];
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

        // limpiar selección
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

    // ===== BÚSQUEDA MULTI-CDP (valida mismo NIT) =====
    buscarT17Multiple(nit: any) {
        if (this.sinCDPChecked) return;

        // UX: si el usuario digitó el CDP pero no presionó agregar, lo auto-agregamos
        this.autoAddCDPIfComplete();

        const nitVal = String(nit ?? '').trim();
        if (!nitVal) {
            Swal.fire('Faltan datos', 'Selecciona primero un NIT.', 'warning');
            return;
        }

        if (!this.cdps || this.cdps.length === 0) {
            Swal.fire('Faltan CDP', 'Agrega al menos un CDP antes de buscar.', 'warning');
            return;
        }

        this.bandera_loading = true;
        this.busquedaOk = false;
        this.bd1 = true;

        const run = (idx: number, maxCuota: number, maxNumcuo: number, algunoDisponible: boolean) => {
            if (idx >= this.cdps.length) {
                this.bandera_loading = false;

                this.busquedaOk = true;
                this.siCDPno = true;

                if (!algunoDisponible) {
                    Swal.fire('Información', 'Todos los CDP agregados ya tienen la totalidad de pagos realizados.', 'info');
                    this.teso13.numcuo = 1;
                    this.cuota = 1;
                    return;
                }

                if (!maxNumcuo && !maxCuota) {
                    this.teso13.numcuo = 1;
                    this.cuota = 1;
                } else {
                    this.teso13.numcuo = maxNumcuo;
                    this.cuota = maxCuota + 1;
                }

                return;
            }

            const c = this.cdps[idx];

            // 1) validar relación CDP-NIT
            this._teso13Service
                .getbusqueda71(new Conta71(c.marca, c.documento, c.ano, this.nitParam(nitVal)))
                .subscribe(respRelacion => {

                    if (!respRelacion) {
                        this.bandera_loading = false;
                        this.bd1 = false;
                        this.busquedaOk = false;
                        Swal.fire('¡Error!', `No existen datos asociados a CDP y NIT para: ${c.marca}-${c.documento}-${c.ano}`, 'error');
                        return;
                    }

                    // 2) obtener info de pagos (teso17)
                    this._teso13Service
                        .getTeso17(new Teso17(nitVal, c.marca, c.documento, String(c.ano), '', '', 0, 0, ''))
                        .subscribe(
                            r => {
                                const numcuoR = Number(r?.numcuo) || 0;
                                const cuotaR = Number(r?.cuota) || 0;

                                if (!numcuoR && !cuotaR) {
                                    algunoDisponible = true;
                                    maxNumcuo = Math.max(maxNumcuo, 1);
                                    maxCuota = Math.max(maxCuota, 0);
                                } else if (numcuoR === cuotaR) {
                                    // completo
                                } else {
                                    algunoDisponible = true;
                                    maxNumcuo = Math.max(maxNumcuo, numcuoR);
                                    maxCuota = Math.max(maxCuota, cuotaR);
                                }

                                run(idx + 1, maxCuota, maxNumcuo, algunoDisponible);
                            },
                            _ => {
                                this.bandera_loading = false;
                                this.bd1 = false;
                                this.busquedaOk = false;
                                Swal.fire('Error', `No fue posible consultar pagos para: ${c.marca}-${c.documento}-${c.ano}`, 'error');
                            }
                        );
                });
        };

        run(0, 0, 0, false);
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
        // UX: si el usuario digitó el CDP pero no presionó agregar, lo auto-agregamos
        this.autoAddCDPIfComplete();

        // Guardia: si requiere búsqueda (NO SIN CDP) y aún no se hizo, impedir envío
        if (this.requiereBusqueda && !this.busquedaOk) {
            Swal.fire('Falta la búsqueda', 'Debes presionar "Buscar Pagos asociados a NIT y CDP(s)" antes de continuar.', 'warning');
            return;
        }

        if (this.centros.length === 0) {
            Swal.fire('Faltan datos', 'Agrega al menos un Centro de Costo.', 'warning');
            return;
        }

        if (!this.sinCDPChecked && (!this.cdps || this.cdps.length === 0)) {
            Swal.fire('Faltan CDP', 'Agrega al menos un CDP.', 'warning');
            return;
        }

        Swal.fire({
            title: '¿Estas Seguro?',
            html: `
        <strong class="font__weight">Importante antes de iniciar el pago!</strong>
        <ul style="text-align: left;">
          <li>ESTE FORMATO NO PODRÁ SER MODIFICADO, EN LO REFERENTE A REQUISITOS Y A SU FORMA SIN PREVIA
            AUTORIZACIÓN DE LA COORDINACIÓN DE TESORERÍA Y LA LEGALIZACIÓN DEL CAMBIO ANTE LA COORDINACIÓN
            DE DESARROLLO ORGANIZACIONAL</li>
          <li>Para el tramite de la cuenta debe obligatoriamente diligenciar este formato en su totalidad</li>
          <li>Los requisitos se actualizarán de acuerdo con la normatividad vigente.</li>
          <li>Cuando es un pago por primera vez se debe anexar el Formato de Información y Pagos Mediante el
            Sistema de Traslado Electrónico.</li>
          <li>Certificación Bancaria, Pagos por primera vez o cuando modifique la cuenta bancaria.</li>
          <li>Verificar que la resolución de la factura esté vigente (dos años).</li>
          <li>Cuando se trate de cuentas con provisión del año inmediatamente anterior, se debe anexar soporte
            de la misma emitido por la Coordinación de Contabilidad.</li>
          <li>Cuando se trate de legalización de cuentas de periodos anteriores no provisionadas o que requieran
            pago después de las fechas de cierre, debe soportarse con oficio o acta del Comité de Conciliación
            Contable, emitido por la oficina Jurídica.</li>
          <li>Cuando se trate de modificaciones al contrato inicial (monto, plazo o supervisión), debe adjuntarse
            copia del Otro Sí en la cuenta siguiente a dicho cambio.</li>
          <li>Los documentos soportes para trámite de pago deben imprimirse a doble cara.</li>
          <li>La firma y la fecha son los únicos campos que se pueden diligenciar a mano.</li>
          <li>Los formatos para certificación de ejecución contractual, informe de supervisión/interventoría y
            revisión de requisitos aplican únicamente para contratistas.</li>
        </ul>
      `,
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
            this.teso13.upload_token = uploadToken;

            // Empaquetar CC varios en JSON (para backend)
            this.teso13.centros_json = JSON.stringify(this.centros || []);

            const navegar = () => {
                // CDP principal: el primero de la lista (compatibilidad)
                const cdpPrincipal = (!this.sinCDPChecked && this.cdps.length > 0)
                    ? this.cdps[0]
                    : { marca: 'OP', documento: '00', ano: 0 };

                const arrayD = [
                    this.tpago,
                    this.nit_nombre,
                    this.subdir_nombre,
                    this.dep_nombre,
                    cdpPrincipal.marca,
                    cdpPrincipal.documento,
                    cdpPrincipal.ano,
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

            // Flujo de envío según SIN CDP o CON CDP(s)
            if (!this.sinCDPChecked) {
                // CON CDP(s): valida sumatoria del valor disponible
                this.teso13.sCDPn = true;

                // setear primer CDP en campos clásicos (compatibilidad)
                this.teso13.cdp_marca = this.cdps[0].marca;
                this.teso13.cdp_documento = this.cdps[0].documento;
                this.teso13.cdp_ano = this.cdps[0].ano; // integer

                // enviar todos
                this.syncCdpsJson();

                let total = 0;

                const sumar = (i: number) => {
                    if (i >= this.cdps.length) {
                        if (total >= valorNum) navegar();
                        else Swal.fire('Error!', 'Pago No Enviado, valor total de CDP(s) insuficiente', 'error');
                        return;
                    }

                    const c = this.cdps[i];
                    const anoNum = Number(c.ano);

                    this._teso13Service.valorCDP(new Conta71(c.marca, c.documento, anoNum, this.teso13.nit))
                        .subscribe(resp => {
                            total += (Number(resp) || 0);
                            sumar(i + 1);
                        }, _ => {
                            Swal.fire('Error', `No fue posible validar valor del CDP: ${c.marca}-${c.documento}-${c.ano}`, 'error');
                        });
                };

                sumar(0);

            } else {
                // SIN CDP: setear defaults y continuar
                this.teso13.sCDPn = false;
                this.teso13.cdp_ano = 0;
                this.teso13.cdp_documento = '00';
                this.teso13.cdp_marca = 'OP';
                this.teso13.cdps_json = '';
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

        if (this.teso13.nit == '') {
            Swal.fire('Información', 'Primero debe de diligenciar el nit!').then(() => {
                window.location.reload();
            });
        }

        this.numfac = new Numfac(event.target.value, this.teso13.nit);
        this._teso13Service.verificarNumero(this.numfac).subscribe(
            response => {
                this.bandera_loading = false;
                if (response.status === 'success' && response.bandera === '1') {
                    Swal.fire('Información', 'Este numero de factura: ' + event.target.value + ' con este nit: ' + this.teso13.nit + ' ya existe en un pago!');
                }
            },
            _ => { this.bandera_loading = false; }
        );
    }

}

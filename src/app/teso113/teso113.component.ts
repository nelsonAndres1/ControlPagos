import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

import { Teso15Service } from '../services/teso15.service';
import { Teso13Service } from '../services/teso13.service';
import { PdfService } from '../services/pdf.service';
import { Gener02Service } from '../services/gener02.service';

import { Teso113 } from '../models/teso113';
import { teso10 } from '../models/teso10';
import { Gener02 } from '../models/gener02';
import { Impresion } from '../models/impresion';

interface Teso13Data {
    fecrad: string;
    usuela: string;
    numfac?: string;
    nit?: string;
    coddep?: string;
    codcen?: string;
    peraut?: string;
    perrev?: string;
    numero?: string | number;
    valor?: number | string;
    numcon?: string;
    numfol?: string;
    usucau?: string;
    detalle?: string;
    anexos_magneticos?: string;
    centros_json?: string;
    codclas?: string;
}

@Component({
    selector: 'app-teso113',
    templateUrl: './teso113.component.html',
    styleUrls: ['./teso113.component.css'],
    providers: [Teso15Service, Teso13Service, PdfService, Gener02Service],
})
export class Teso113Component implements OnInit {
    // ====== Parámetros / estado ======
    itemDetail: any[] = [];

    numero!: string;          // SIEMPRE como string (con padding)
    codclas!: string;

    nitReal!: string;         // NIT numérico/real de itemDetail[7]
    nitNombreUI?: string;     // itemDetail[1] por si lo usas en UI

    cc: string = '';
    depe: string = '';
    cdp_marca: string = '';
    cdp_documento: string = '';
    cdp_ano: string = '';

    // Datos obtenidos
    data!: Teso13Data;
    detalleTeso10: string = '';
    usuarioNombre: string = '';
    conta04Nombre?: string;

    // Soportes
    nombre_soportes_pago: string = '';
    soportes: string[] = [];

    // Objeto para PDF
    impreseion: Impresion = new Impresion(
        '', '', '', '', '', '', '', '', '', '', '',
        '', // documento_clase
        '', '', '',
        '', // codigo_barras
        '', // coddep
        '', // fecha
        '', // valor
        '', // cdp
        '', // numcon
        '', // numfol
        '', // usucau
        '', // detalle
        '', // anexos_magneticos
        ''  // centros_json (opcional)
    );

    // Reqs auxiliares
    teso10Req: teso10 = new teso10('', '', '', '', '', '');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private teso15Srv: Teso15Service,
        private teso13Srv: Teso13Service,
        private pdfSrv: PdfService,
        private gener02Srv: Gener02Service
    ) { 

        this.descargarPDF();
    }


    /** Intenta extraer un arreglo desde distintas formas comunes de respuesta */
    private extractArray(input: any, candidateKeys: string[] = []): any[] {
        // ya es array
        if (Array.isArray(input)) return input;

        // viene envuelto: { data: [...] }, { items: [...] }, { soportes: [...] }, etc.
        for (const k of candidateKeys) {
            const v = input?.[k];
            if (Array.isArray(v)) return v;
            if (typeof v === 'string') return this.splitCsv(v);
        }

        // viene como string "a, b, c"
        if (typeof input === 'string') return this.splitCsv(input);

        // nada reconocible -> arreglo vacío
        return [];
    }

    /** Convierte "a, b, c" en ['a','b','c'] */
    private splitCsv(s: string): string[] {
        return s.split(',')
            .map(x => x.trim())
            .filter(Boolean);
    }

    // =========================================
    // Ciclo de vida
    // =========================================
    async ngOnInit(): Promise<void> {
        try {
            // 1) Leer query params
            const q = await firstValueFrom(this.route.queryParams);
            const paramsData = q['result'] ? JSON.parse(q['result']) : [];
            const numeroPago = q['numeroPago'] ?? '';

            this.itemDetail = paramsData;

            this.codclas = String(this.itemDetail[0] ?? '');
            this.nitNombreUI = this.itemDetail[1] ?? '';
            this.cc = String(this.itemDetail[2] ?? '');
            this.depe = String(this.itemDetail[3] ?? '');
            this.cdp_marca = String(this.itemDetail[4] ?? '');
            this.cdp_documento = String(this.itemDetail[5] ?? '');
            this.cdp_ano = String(this.itemDetail[6] ?? '');
            this.nitReal = String(this.itemDetail[7] ?? '');

            this.numero = this.padNumero(String(numeroPago));
            sessionStorage.setItem('ultimo_numero_pago', this.numero);

            // 2) Cargar datos base del pago
            const teso113 = new Teso113(this.codclas, this.numero);
            this.teso10Req = new teso10(this.codclas, this.numero, '', '', '', '');

            const dataResp = await firstValueFrom(this.teso15Srv.getAllTeso13(teso113));
            if (!dataResp || dataResp?.status === 'error') {
                throw new Error('No se encontraron datos del pago.');
            }
            this.data = dataResp as Teso13Data;

            // 3) Resolver dependencias en paralelo
            const [
                detclasResp,
                usuarioResp,
                conta04Resp,
                soportesPagoResp,
                soportesResp,
            ] = await Promise.all([
                firstValueFrom(this.teso13Srv.name_teso10(new teso10(this.codclas, '', '', '', '', ''))),
                firstValueFrom(this.teso15Srv.getUsuario(new Gener02(this.data.usuela, ''))),
                firstValueFrom(this.gener02Srv.getConta04({ nit: this.nitReal })),
                firstValueFrom(this.teso13Srv.getSoportesForPago(teso113)),
                firstValueFrom(this.teso13Srv.getSoportes(this.teso10Req)),
            ]);

            this.detalleTeso10 = detclasResp?.detclas ?? '';
            this.usuarioNombre = (usuarioResp?.[0]?.nombre) ?? '';
            this.conta04Nombre = conta04Resp?.conta04 ?? undefined;

            const soportesPagoArr = this.extractArray(soportesPagoResp, ['data', 'items', 'results', 'soportes']);
            this.nombre_soportes_pago = soportesPagoArr
                .map((s: any) => (typeof s === 'string' ? s : s?.detalle_codsop ?? s?.detalle ?? ''))
                .filter(Boolean)
                .join(', ');

            const soportesArr = this.extractArray(soportesResp, ['data', 'soportes', 'items', 'results']);
            this.soportes = soportesArr.map((s: any) => String(s?.detalle ?? s?.name ?? s));

            // 4) Armar objeto impresión (PDF)
            const { dia, mes, año } = this.extraerFecha(new Date(this.data.fecrad));

            this.impreseion.dia = String(dia);
            this.impreseion.mes = String(mes);
            this.impreseion.ano = String(año);

            this.impreseion.numero_factura = this.data.numfac ?? '';
            this.impreseion.numero_contrato = ''; // si aplica
            this.impreseion.nombre_persona = this.conta04Nombre ?? this.nitNombreUI ?? this.nitReal;
            this.impreseion.nit_persona = this.data.nit ?? this.nitReal;

            this.impreseion.subdireccion = '';
            this.impreseion.dependencia = `${this.data.coddep ?? ''} ${this.depe ?? ''}`.trim();
            this.impreseion.centro_costo = `${this.data.codcen ?? ''} ${this.cc ?? ''}`.trim();
            this.impreseion.clase_pago = `${this.data.codclas ?? this.codclas} ${this.detalleTeso10 ?? ''}`.trim();

            this.impreseion.documento_clase = this.nombre_soportes_pago;

            this.impreseion.nombre_elaborado = this.usuarioNombre ?? '';
            this.impreseion.nombre_autoriza = this.data.peraut ?? '';
            this.impreseion.nombre_revisa = this.data.perrev ?? '';

            this.impreseion.codigo_barras = `${this.data.codclas ?? this.codclas}${this.data.numero ?? this.numero}`;
            this.impreseion.coddep = this.data.coddep ?? '';
            this.impreseion.fecha = this.data.fecrad ?? '';
            this.impreseion.valor = String(this.data.valor ?? '');
            this.impreseion.cdp =
                (this.cdp_documento === '00' || !this.cdp_documento)
                    ? '-'
                    : `${this.cdp_marca ?? ''}-${this.cdp_documento}-${this.cdp_ano ?? ''}`;
            this.impreseion.numcon = this.data.numcon ?? '';
            this.impreseion.numfol = this.data.numfol ?? '';
            this.impreseion.usucau = this.data.usucau ?? '';
            this.impreseion.detalle = this.data.detalle ?? '';
            this.impreseion.anexos_magneticos = this.data.anexos_magneticos ?? '';
            this.impreseion.centros_json = this.data.centros_json ?? '';

        } catch (error: any) {
            console.error('Fallo en Teso113Component (init):', error);
            Swal.fire({
                icon: 'error',
                title: 'Error cargando información',
                text: error?.message || 'No fue posible cargar los datos del pago.',
            });
        }
    }

    // =========================================
    // Acciones UI
    // =========================================
    async descargarPDF(): Promise<void> {
        try {
            // Loader breve
            let timer: any;
            await Swal.fire({
                title: 'Generando PDF…',
                html: 'El proceso terminará en <b></b> ms.',
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const b = Swal.getHtmlContainer()?.querySelector('b');
                    timer = setInterval(() => {
                        if (b) b.textContent = String(Swal.getTimerLeft());
                    }, 100);
                },
                willClose: () => clearInterval(timer),
            });

            // Llamar backend PDF
            const pdfBlob: any = await firstValueFrom(this.pdfSrv.generarPDF(this.impreseion));
            const blob = new Blob([pdfBlob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);

            // Navegar (opcional)
            this.router.navigate(['/principal']);
        } catch (error: any) {
            console.error('Error al generar PDF:', error);
            Swal.fire({
                icon: 'error',
                title: 'No se pudo generar el PDF',
                text: error?.message || 'Ocurrió un error inesperado.',
            });
        }
    }

    // =========================================
    // Utilidades
    // =========================================
    private padNumero(n: string): string {
        return n.length < 7 ? n.padStart(7, '0') : n;
    }

    private extraerFecha(fecha: Date): { dia: number; mes: number; año: number } {
        return {
            dia: fecha.getUTCDate(),
            mes: fecha.getUTCMonth() + 1,
            año: fecha.getUTCFullYear(),
        };
    }
}

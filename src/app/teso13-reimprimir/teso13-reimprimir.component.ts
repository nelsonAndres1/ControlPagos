import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Teso13Service } from '../services/teso13.service';
import { Gener02Service } from '../services/gener02.service';
import { Teso15Service } from '../services/teso15.service';
import { PdfService } from '../services/pdf.service';
import { UtilidadesService } from '../services/utilidades.service';
import { Gener02 } from '../models/gener02';
import { Impresion } from '../models/impresion';
import { Teso113 } from '../models/teso113';

@Component({
  selector: 'app-teso13-reimprimir',
  templateUrl: './teso13-reimprimir.component.html',
  styleUrls: ['./teso13-reimprimir.component.css'],
  providers: [Teso13Service, Gener02Service, Teso15Service, PdfService, UtilidadesService]
})
export class Teso13ReimprimirComponent {

  identity: any;
  data: any[] = [];
  vacio: string | null = null;

  impreseion: Impresion;

  // helpers de UI
  cargando: boolean = false;

  constructor(
    private _PdfService: PdfService,
    private _teso15Service: Teso15Service,
    private _teso13Service: Teso13Service,
    private _gener02Service: Gener02Service,
    private _utilidadesService: UtilidadesService,
    private teso15Srv: Teso15Service,

  ) {
    this.identity = this._gener02Service.getIdentity?.();

    // Asegúrate que en tu clase Impresion el tipo sea string, no "".
    this.impreseion = new Impresion(
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
  }

  // ==============================
  // Búsqueda incremental por número
  // ==============================
  async getTeso13(event: Event): Promise<void> {
    try {
      const input = event.target as HTMLInputElement;
      const keyword = {
        keyword: input.value,
        usuario: this.identity?.sub ?? ''
      };
      const resp = await firstValueFrom(this._teso13Service.searchTeso13(keyword));
      // asumo que el servicio retorna array directamente; si no, normalizamos:
      this.data = Array.isArray(resp) ? resp : (resp?.data ?? []);
    } catch (e) {
      console.error('Error en getTeso13:', e);
      this.data = [];
    }
  }

  // ==============================
  // Reimprimir un pago (click en card o botón)
  // ==============================
  async getPago(dt: any): Promise<void> {
    try {
      this.cargando = true;

      const codclas: string = String(dt.codclas ?? '');
      const numero: string = this.padNumero(String(dt.numero ?? ''));

      // 1) Soportes del pago
      const soportesPagoResp = await firstValueFrom(this._teso13Service.getSoportesForPago(new Teso113(codclas, numero)));
      const soportesPagoArr = this.extractArray(soportesPagoResp, ['data', 'items', 'results', 'soportes']);
      const nombre_soportes_pago = soportesPagoArr
        .map((s: any) => (typeof s === 'string' ? s : (s?.detalle_codsop ?? s?.detalle ?? '')))
        .filter(Boolean)
        .join(', ');

      // 2) Datos completos del pago (detalle/anexos/centros_json, etc.)
      const detallePagoResp = await firstValueFrom(this._teso15Service.getAllTeso13(new Teso113(codclas, numero)));
      console.log('Detalle pago para reimpresión:', detallePagoResp);
      if (detallePagoResp?.status === 'error') {
        throw new Error('No se encontraron datos del pago para reimpresión.');
      }

      // 3) Armar objeto Impresion con lo que ya tienes en dt y lo que devuelve el detalle
      const { dia, mes, año } = this.extraerFecha(new Date(dt.fecrad));





      this.impreseion.dia = String(dia);
      this.impreseion.mes = String(mes);
      this.impreseion.ano = String(año);

      this.impreseion.numero_factura = String(dt.numfac ?? '');
      this.impreseion.nit_persona = String(dt.nit ?? '');
      this.impreseion.nombre_persona = ''; // se llenará con Conta04 más abajo
      this.impreseion.subdireccion = '';

      this.impreseion.dependencia = String(dt.coddep ?? '');
      this.impreseion.centro_costo = String(dt.codcen ?? '');
      this.impreseion.clase_pago = String(dt.codclas ?? '');

      this.impreseion.nombre_elaborado = String(dt.usuela ?? '');

      const [
        usuarioResp,
      ] = await Promise.all([
        firstValueFrom(this.teso15Srv.getUsuario(new Gener02(dt.usuela, ''))),
      ]);

      this.impreseion.documento_elaborado = (usuarioResp?.[0]?.cedtra) ?? '';
      this.impreseion.nombre_autoriza = String(dt.peraut ?? '');
      this.impreseion.nombre_revisa = String(dt.perrev ?? '');

      this.impreseion.codigo_barras = `${dt.codclas ?? ''}${dt.numero ?? ''}`;
      this.impreseion.coddep = String(dt.coddep ?? '');
      this.impreseion.fecha = String(dt.fecrad ?? '');

      // CDP / Valor en estilos más “limpios” (sin prefijos fijos “CDP:”/“VALOR:”)
      const cdp_marca = String(dt.cdp_marca ?? '');
      const cdp_documento = String(dt.cdp_documento ?? '');
      const cdp_ano = String(dt.cdp_ano ?? '');

      if (cdp_documento.trim() == '00') {
        this.impreseion.cdp = ' ';
      } else {
        this.impreseion.cdp = (cdp_documento && cdp_documento !== '00') ? `${cdp_marca}${cdp_documento}${cdp_ano}` : '-';
      }
      this.impreseion.valor = String(dt.valor ?? '');

      this.impreseion.documento_clase = nombre_soportes_pago;
      this.impreseion.numcon = String(dt.numcon ?? '');
      this.impreseion.numfol = String(dt.numfol ?? '');

      // del detalle de pago (response del servicio)
      this.impreseion.detalle = String(detallePagoResp?.detalle ?? '');
      this.impreseion.anexos_magneticos = String(detallePagoResp?.anexos_magneticos ?? '');
      this.impreseion.centros_json = String(detallePagoResp?.centros_json ?? '');
      this.impreseion.cdps_json = String(detallePagoResp?.cdps_json ?? '');

      // 4) Enriquecer nombres (Conta04 / Gener02, etc.)
      // getAllConta04 espera el objeto Impresion (según tu código)
      const conta04 = await firstValueFrom(this._utilidadesService.getAllConta04(this.impreseion));
      // Normaliza llaves esperadas
      const detalle_razsoc = conta04?.detalle_razsoc ?? '';
      const detalle_codcen = conta04?.detalle_codcen ?? '';
      const detalle_dependencia = conta04?.detalle_dependencia ?? '';
      const detalle_pago = conta04?.detalle_pago ?? '';
      const detalle_gener02 = conta04?.detalle_gener02 ?? '';

      this.impreseion.nombre_persona = detalle_razsoc || this.impreseion.nombre_persona;
      this.impreseion.centro_costo = detalle_codcen || this.impreseion.centro_costo;
      this.impreseion.dependencia = `${dt.coddep ?? ''}${detalle_dependencia ? ' - ' + detalle_dependencia : ''}`;
      this.impreseion.clase_pago = detalle_pago || this.impreseion.clase_pago;
      this.impreseion.nombre_elaborado = detalle_gener02 || this.impreseion.nombre_elaborado;
      this.impreseion.impresion = 'R';

      // 5) Generar y abrir PDF
      await this.descargarPDF();

    } catch (e: any) {
      console.error('Error en reimpresión:', e?.message ?? e);
    } finally {
      this.cargando = false;
    }
  }

  // ==============================
  // Descargar PDF
  // ==============================
  async descargarPDF(): Promise<void> {
    try {
      const pdfBlob: any = await firstValueFrom(this._PdfService.generarPDF(this.impreseion));
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (e) {
      console.error('Error al generar PDF:', e);
    }
  }

  // ==============================
  // Helpers
  // ==============================
  private extraerFecha(fecha: Date): { dia: number, mes: number, año: number } {
    return {
      dia: fecha.getUTCDate(),
      mes: fecha.getUTCMonth() + 1,
      año: fecha.getUTCFullYear()
    };
  }

  private padNumero(n: string): string {
    return n.length < 7 ? n.padStart(7, '0') : n;
  }

  /** Intenta extraer un arreglo desde distintas formas comunes de respuesta */
  private extractArray(input: any, candidateKeys: string[] = []): any[] {
    if (Array.isArray(input)) return input;

    for (const k of candidateKeys) {
      const v = input?.[k];
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') return this.splitCsv(v);
    }

    if (typeof input === 'string') return this.splitCsv(input);

    return [];
  }

  /** Convierte "a, b, c" en ['a','b','c'] */
  private splitCsv(s: string): string[] {
    return s.split(',').map(x => x.trim()).filter(Boolean);
  }
}

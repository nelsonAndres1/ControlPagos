import { Component } from '@angular/core';
import { Teso13Service } from '../services/teso13.service';
import { Gener02Service } from '../services/gener02.service';
import { Editarteso13 } from '../models/editarteso13';
import { Router } from '@angular/router';
import { Teso13 } from '../models/teso13';
import Swal from 'sweetalert2';
import { UtilidadesService } from '../services/utilidades.service';

type CentroCosto = { codcen: string; detalleCC: string };

@Component({
  selector: 'app-teso13editar',
  templateUrl: './teso13editar.component.html',
  styleUrls: ['./teso13editar.component.css'],
  providers: [Teso13Service, Gener02Service, UtilidadesService]
})
export class Teso13editarComponent {

  // Estado general
  bandera_formulario = false;
  bandera_loading = false;

  // Búsqueda y resultados de pagos
  vacio: string | null = null;
  data: any[] = [];
  data_teso13: any[] = [];

  // Entidad a editar
  teso13: any;

  // Listas y banderas de búsqueda
  datac2: any[] = []; bandera2 = false; nit_nombre: string = '';
  dataSubdir: any[] = []; banderaSubdir = false; subdir_nombre = '';
  datac28: any[] = []; bandera28 = false; coddep_nombre: string = '';

  // Centro de Costo (varios)
  ccVarios = false;
  cc_nombre = '';
  dataCC: any[] = []; banderaCC = false;
  cc_actual_cod = ''; cc_actual_detalle = '';
  centros: CentroCosto[] = [];

  // CDP
  marca: string[] = ['AC', 'OP', 'SU'];
  cdp_bandera = false; // ¿SIN CDP?

  // Personas
  personas_revisa: any[] = [];
  personas_autoriza: any[] = [];

  // Periodos
  periodos: string[] = [];

  // Otras
  identity: any;
  editarteso13: Editarteso13;
  cuotaActual: string | number | null = null;

  constructor(
    private router: Router,
    private _teso13Service: Teso13Service,
    private _gener02Service: Gener02Service,
    private _utilidadesService: UtilidadesService,
  ) {
    this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', null, '', '', '0', '', '', '', '');
    this.teso13.centros_json = ''; // campo dinámico sin modificar el modelo

    this.identity = this._gener02Service.getIdentity();
    this.editarteso13 = new Editarteso13('', '', '', '', '', '', '', '', '', '', '', '', '', this.identity.sub, this.identity.sub);
    this.editarteso13.usuario = this.identity.sub;

    // Periodos (año actual)
    const y = new Date().getFullYear();
    this.periodosT(y, y);

    // Cargar listado para editar (si aplica)
    this._teso13Service.getTeso13Editar(this.editarteso13).subscribe(
      (response: any[]) => { this.data_teso13 = response || []; }
    );

    // Listas de personas
    this._utilidadesService.getAutorizaRevisa({ 'opcion': 'REVISA' }).subscribe(r => this.personas_revisa = r || []);
    this._utilidadesService.getAutorizaRevisa({ 'opcion': 'AUTORIZA' }).subscribe(r => this.personas_autoriza = r || []);
  }

  // ===== Utilidades =====
  periodosT(añoI: number, añoF: number) {
    if (añoI > añoF) return;
    for (let y = añoI; y <= añoF; y++) {
      for (let m = 1; m <= 12; m++) {
        this.periodos.push(`${y}${m < 10 ? '0' + m : m}`);
      }
    }
  }

  // ===== Buscar pago =====
  getTeso13(event: any) {
    this.bandera_formulario = false;
    this.data = [];
    const keyword: any = { keyword: event.target.value, usuario: this.identity.sub };
    this._teso13Service.searchTeso13(keyword).subscribe((response: any[]) => {
      this.data = response || [];
    });
  }

  // ===== Seleccionar pago a editar =====
  getPago(dt: any) {
    this.data = [];
    this.teso13 = { ...dt }; // clonar
    this.vacio = dt.codclas + dt.numero;
    this.bandera_formulario = true;


    console.log('Pago seleccionado:', dt);
    // CDP (SIN CDP si marca=OP y doctos "00"/año=0)
    this.cdp_bandera = (this.teso13.cdp_marca === 'OP'
      && (this.teso13.cdp_documento === '00' || this.teso13.cdp_documento === 0)
      && (this.teso13.cdp_ano === '0' || this.teso13.cdp_ano === 0));

    // Subdirección / Dependencia nombres
    this.subdir_nombre = dt.detalle_codcen || '';
    this.coddep_nombre = dt.detalle_coddep || '';

    // NIT nombre
    this.nit_nombre = dt.razsoc || '';

    // Cuota actual si viene del backend
    this.cuotaActual = (dt.cuota ?? null);

    // numfol como número si el input es type=number
    this.teso13.numfol = (dt.numfol !== undefined && dt.numfol !== null)
      ? Number(dt.numfol)
      : dt.numfol;

    // Precargar centros_json
    this.centros = [];
    try {
      if (dt.centros_json) {
        const arr = JSON.parse(dt.centros_json);
        if (Array.isArray(arr)) {
          this.centros = arr
            .filter(x => x && typeof x.codcen === 'string')
            .map(x => ({ codcen: x.codcen, detalleCC: x.detalleCC || '' }));
        }
      }
    } catch { this.centros = []; }
  }

  // ===== CDP toggle =====
  toggleSinCDP() {
    this.cdp_bandera = !this.cdp_bandera;
    if (this.cdp_bandera) {
      this.teso13.cdp_marca = 'OP';
      this.teso13.cdp_documento = '00';
      this.teso13.cdp_ano = '0';
    }
  }

  // ===== NIT =====
  getConta04(e: any) {
    this.bandera_loading = true;
    const keyword = e.target.value;
    this._teso13Service.getConta04(keyword).then(
      (response: any) => {
        this.bandera_loading = false;
        const arr = Array.isArray(response) ? response : (response?.data ?? []);
        this.datac2 = Array.isArray(arr) ? arr : [];
        this.bandera2 = true;
      },
      _ => { this.bandera_loading = false; }
    );
  }

  touchNit(resultC: any) {
    this.teso13.nit = resultC.nit;
    this.nit_nombre = resultC.razsoc;
    this.bandera2 = false;
  }

  // ===== Subdirección (codcen) =====
  buscarSubdir(e: any) {
    this.bandera_loading = true;
    const keyword = e.target.value;
    this._teso13Service.getConta06(keyword).then(
      (r: any) => {
        this.bandera_loading = false;
        const arr = Array.isArray(r) ? r : (r && Array.isArray(r.data) ? r.data : []);
        this.dataSubdir = arr;
        this.banderaSubdir = true;
      },
      _ => { this.bandera_loading = false; }
    );
  }

  touchSubdir(r: any) {
    this.teso13.codcen = r.codcen;
    this.subdir_nombre = r.detalle;
    this.banderaSubdir = false;

    // al cambiar subdirección, reinicia dependencia
    this.teso13.coddep = '';
    this.coddep_nombre = '';
  }

  // ===== Dependencia (coddep) =====
  buscarDep(e: any) {
    this.bandera_loading = true;
    this._teso13Service.getConta28({ data: e.target.value, codcen: this.teso13.codcen }).subscribe(
      (r: any) => {
        this.bandera_loading = false;
        const arr = Array.isArray(r) ? r : (r && Array.isArray(r.data) ? r.data : []);
        this.datac28 = arr;
        this.bandera28 = true;
      },
      _ => { this.bandera_loading = false; }
    );
  }

  touchDep(r2: any) {
    this.teso13.coddep = r2.coddep;
    this.coddep_nombre = r2.detalle;
    this.bandera28 = false;
  }

  // ===== Centro de Costo (varios) =====
  toggleCCVarios() { this.ccVarios = !this.ccVarios; }

  buscarCC(e: any) {
    this.bandera_loading = true;
    const keyword = e.target.value;
    this._teso13Service.getConta06(keyword).then(
      (r: any) => {
        this.bandera_loading = false;
        const arr = Array.isArray(r) ? r : (r && Array.isArray(r.data) ? r.data : []);
        this.dataCC = arr;
        this.banderaCC = true;
      },
      _ => { this.bandera_loading = false; }
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
    this.cc_actual_cod = '';
    this.cc_actual_detalle = '';
    this.cc_nombre = '';
  }

  removeCentro(i: number) { this.centros.splice(i, 1); }

  // ===== Formato del valor (miles con punto, decimales coma) =====
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

  // ===== Enviar actualización =====
  onSubmit(form: any) {
    // empaquetar CC varios
    this.teso13.centros_json = JSON.stringify(this.centros || []);

    // normalizar contrato vacío
    if ((this.teso13.numcon + '').trim() === '') this.teso13.numcon = '0';

    this._teso13Service.teso13update(this.teso13).subscribe(
      (response: any) => {
        Swal.fire('Información', response.message, response.status).then(() => {
          form.reset();
          this.bandera_formulario = false;
          this.data = [];
        });
      }
    );
  }

  // Navegación (no usada aquí)
  getDetailPage(_result: any) { }
  getDetailPageC28(_resultC2: any) { }
}

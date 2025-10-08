import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Teso16Service } from '../services/teso16.service';
import { Teso16 } from '../models/teso16';

// debajo de tus imports
type ReportRow = { usuario: string; nombre: string; cedtra: string; estche: string; permiso: string; };

// cambia la definición de reporte para usar el tipo:


@Component({
    selector: 'app-teso1116',
    templateUrl: './teso1116.component.html',
    styleUrls: ['./teso1116.component.css']
})
export class Teso1116Component implements OnInit {
    // Texto visible en la UI (orden mostrado)
    public estados: string[] = [
        'Administrador',
        'Radicación',
        'Revisión',
        'Autorizado',
        'Financiera',
        'Causación',
        'Causación Pago',
        'Autorización Pago',
        'Preparación Transferencia',
        'Aprobación de transferencia',
        'Pago',
        'Cheque en Firmas'
    ];
    //    public reporte: Array<{ usuario: string; nombre: string; cedtra: string; estche: string; permiso: string; }> = [];
    public cargandoReporte = false;
    public reporte: ReportRow[] = [];

    // agrega este trackBy (puedes ponerlo junto a los otros trackBy)
    public trackByReporte = (_: number, r: ReportRow) => `${r.usuario}|${r.estche}`;

    // Fuente de la verdad: nombre → código
    private estadoToCode: Record<string, string> = {
        'Administrador': 'AD',
        'Radicación': 'RA',
        'Revisión': 'RV',
        'Autorizado': 'AU',
        'Financiera': 'FI',
        'Causación': 'CT',
        'Causación Pago': 'PC',
        'Autorización Pago': 'RT',
        'Preparación Transferencia': 'RP',
        'Aprobación de transferencia': 'VF',
        'Pago': 'P',
        'Cheque en Firmas': 'CF',

        // Disponibles por si luego los muestras en la tabla de "agregar"
        'Cheque Entregado': 'CE',
        'Pago Exitoso': 'PE',
        'Causación de Pago': 'CA'
    };

    // Inverso para mostrar legible desde el código
    public codeToNombre: Record<string, string> = {};

    // Datos del usuario (de query params)
    public itemDetail: any = {};

    // Selección actual de permisos a AGREGAR (códigos)
    public selectedCodes = new Set<string>();

    // Permisos existentes en BD (códigos)
    public existingCodes = new Set<string>();

    // Selección de permisos a ELIMINAR (códigos)
    public removeCodes = new Set<string>();

    // Flags
    public isSubmitting = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private teso16Service: Teso16Service
    ) {
        // Construir inverso
        for (const [nombre, code] of Object.entries(this.estadoToCode)) {
            this.codeToNombre[code] = nombre;
        }

        // Leer query params
        this.route.queryParams.subscribe(q => {
            const raw = q['result'];
            if (raw) {
                try {
                    this.itemDetail = JSON.parse(raw);
                } catch {
                    this.itemDetail = {};
                }
            }
            if (this.itemDetail?.usuario) {
                this.getTeso16();
            }
        });
    }

    ngOnInit(): void { }

    /** Getter conveniente para iterar Sets en el template */
    get existingList(): string[] {
        return [...this.existingCodes].sort();
    }
    get removeList(): string[] {
        return [...this.removeCodes].sort();
    }
    get selectedList(): string[] {
        return [...this.selectedCodes].sort();
    }

    /** Mapea nombre visible → código */
    private toCode(nombre: string): string {
        return this.estadoToCode[nombre] || '';
    }

    /** Sabe si un checkbox de "agregar" debe estar marcado */
    public isChecked(nombre: string): boolean {
        const code = this.toCode(nombre);
        return !!code && (this.selectedCodes.has(code) || this.existingCodes.has(code));
    }

    /** Toggle de selección en lista de "agregar" */
    public onChangeAgregar(event: Event, nombre: string): void {
        const checkbox = event.target as HTMLInputElement;
        const code = this.toCode(nombre);
        if (!code) return;

        if (checkbox.checked) {
            this.selectedCodes.add(code);
        } else {
            this.selectedCodes.delete(code);
            // Ojo: si existe en BD, desmarcar aquí no lo borra (solo controla lo nuevo a crear)
        }
    }

    /** Marca/desmarca para eliminar (en la tabla de permisos actuales) */
    public toggleRemove(code: string, checked: boolean): void {
        if (checked) this.removeCodes.add(code);
        else this.removeCodes.delete(code);
    }

    /** Cargar permisos existentes del usuario */
    public getTeso16(): void {
        this.teso16Service.getTeso16(new Teso16(this.itemDetail.usuario, null))
            .subscribe({
                next: (response: any) => {
                    const data = response?.data ?? [];
                    this.existingCodes = new Set<string>(
                        data
                            .map((d: any) => (d?.estche || '').trim())
                            .filter((x: string) => !!x)
                    );
                    // Limpia selecciones inconsistentes
                    this.selectedCodes.forEach(c => {
                        if (this.existingCodes.has(c)) this.selectedCodes.delete(c);
                    });
                    this.removeCodes.clear();
                },
                error: (err) => {
                    console.error('Error al obtener permisos existentes', err);
                    this.existingCodes.clear();
                    this.removeCodes.clear();
                }
            });
    }

    /** Enviar creación de permisos nuevos */
    public submitAgregar(): void {
        // Solo los que NO están ya en BD
        const codesToCreate = [...this.selectedCodes].filter(c => !this.existingCodes.has(c));

        if (codesToCreate.length === 0) {
            Swal.fire('Sin cambios', 'No hay permisos nuevos por agregar', 'info');
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: `Agregarás ${codesToCreate.length} permiso(s) a ${this.itemDetail?.nombre || this.itemDetail?.usuario}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'
        }).then(result => {
            if (!result.value) {
                Swal.fire('Cancelado', 'Permiso(s) no agregado(s)', 'error');
                return;
            }

            this.isSubmitting = true;

            // Ejecutar en paralelo
            const requests = codesToCreate.map(code =>
                this.teso16Service.registerTeso16(new Teso16(this.itemDetail.usuario, code))
            );

            let ok = 0, fail = 0, finished = 0;
            const total = requests.length;

            requests.forEach(obs => {
                obs.subscribe({
                    next: (resp: any) => { (resp?.status === 'success') ? ok++ : fail++; },
                    error: () => { fail++; },
                    complete: () => {
                        finished++;
                        if (finished === total) {
                            this.isSubmitting = false;
                            if (ok > 0) {
                                this.getTeso16();
                                this.selectedCodes.clear();
                                Swal.fire('Listo', `Permiso(s) agregado(s): ${ok}. Fallidos: ${fail}`, ok > 0 ? 'success' : 'error');
                                this.router.navigate(['teso116']);
                            } else {
                                Swal.fire('Error', 'No se pudo agregar ningún permiso', 'error');
                            }
                        }
                    }
                });
            });
        });
    }
    toggleRemoveEvent(event: Event, code: string): void {
        const input = event.target as HTMLInputElement;
        this.toggleRemove(code, input.checked);
    }
    public cargarReporte(): void {
        this.cargandoReporte = true;
        this.teso16Service.getReportePermisos().subscribe({
            next: (resp: any) => {
                this.reporte = resp?.data || [];
                this.cargandoReporte = false;
                Swal.fire('OK', `Registros: ${this.reporte.length}`, 'success');
            },
            error: (err) => {
                console.error(err);
                this.cargandoReporte = false;
                Swal.fire('Error', 'No se pudo cargar el reporte', 'error');
            }
        });
    }

    public exportarCSV(): void {
        this.teso16Service.descargarReporteCSV().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reporte_permisos_${new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '')}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error(err);
                Swal.fire('Error', 'No se pudo descargar el CSV', 'error');
            }
        });
    }

    /** Elimina un permiso individual */
    public removeOne(code: string): void {
        Swal.fire({
            title: '¿Eliminar permiso?',
            text: `Se eliminará el permiso: ${this.codeToNombre[code] || code}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EA1737',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(res => {
            if (!res.value) return;
            const payload = { usuario: this.itemDetail.usuario, estche: code };
            this.teso16Service.deleteTeso16(payload).subscribe({
                next: (resp: any) => {
                    if (resp?.status === 'success') {
                        this.existingCodes.delete(code);
                        this.selectedCodes.delete(code);
                        this.removeCodes.delete(code);
                        Swal.fire('Eliminado', 'Permiso eliminado correctamente', 'success');
                    } else {
                        Swal.fire('Atención', resp?.message || 'No se pudo eliminar', 'warning');
                    }
                },
                error: (err) => {
                    console.error(err);
                    Swal.fire('Error', 'Fallo al eliminar el permiso', 'error');
                }
            });
        });
    }

    /** Elimina en lote lo seleccionado en la tabla de permisos actuales */
    public removeSelectedBulk(): void {
        const codes = [...this.removeCodes];
        if (codes.length === 0) {
            Swal.fire('Sin selección', 'No has marcado permisos para eliminar', 'info');
            return;
        }

        Swal.fire({
            title: '¿Eliminar permisos seleccionados?',
            text: `Se eliminarán ${codes.length} permiso(s)`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EA1737',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(res => {
            if (!res.value) return;

            const payload = { usuario: this.itemDetail.usuario, estches: Array.from(this.removeCodes) };
            this.teso16Service.deleteTeso16Bulk(payload).subscribe({
                next: (resp: any) => {
                    codes.forEach(c => {
                        this.existingCodes.delete(c);
                        this.selectedCodes.delete(c);
                    });
                    this.removeCodes.clear();
                    Swal.fire('Eliminado', `Permisos eliminados: ${resp?.deleted ?? codes.length}`, 'success');
                },
                error: (err) => {
                    console.error(err);
                    Swal.fire('Error', 'Fallo al eliminar permisos', 'error');
                }
            });
        });
    }

    // trackBy helpers
    public trackByNombre = (_: number, nombre: string) => nombre;
    public trackByCode = (_: number, code: string) => code;
}

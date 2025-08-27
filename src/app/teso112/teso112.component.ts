import { Component, OnInit } from '@angular/core';
import { teso12 } from '../models/teso12';
import { Teso12Service } from '../services/teso12.service';
import Swal from 'sweetalert2';
import { Router, NavigationExtras } from '@angular/router';
import { Teso112Service } from '../services/teso112.service';
import { Teso11 } from '../models/teso11';
import { Teso14Service } from '../services/teso14.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-teso112',
    templateUrl: './teso112.component.html',
    styleUrls: ['./teso112.component.css'],
    providers: [Teso12Service, Teso112Service]
})
export class Teso112Component implements OnInit {
    data: any;
    public teso12: teso12;
    public status: any;
    public status2: any;
    public teso11: Teso11;
    public dataSoportes: any;
    filtroEstado: 'TODOS' | 'ACTIVO' | 'INACTIVO' = 'TODOS';

    constructor(
        private _teso112Service: Teso112Service,
        private _teso12Service: Teso12Service,
        private _router: Router,
        private _teso14Service: Teso14Service
    ) {
        this.teso12 = new teso12('', '', '');
    }


    setFiltro(estado: 'TODOS' | 'ACTIVO' | 'INACTIVO') {
        this.filtroEstado = estado;
    }


    ngOnInit(): void {
        this.soportes1();
    }

    soportes1() {
        this._teso14Service.getTsoportes({}).subscribe(response => {
            this.dataSoportes = response;
        });
    }

    getTSoportes(pclave: any) {
        const keyword = pclave.target.value;
        const search = this._teso112Service.getTsoportes(keyword).then(response => {
            this.data = response;
        });
    }

    getDetailPage(result: any) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(result)
            }
        };
        this._router.navigate(['/detalle'], navigationExtras);
    }

    async update(item: any) {
        // Esperamos que item tenga estos campos desde backend:
        // item.codsop (id), item.detsop (nombre), item.decsop (descripcion), item.estado (ACTIVO/INACTIVO, u otro string)
        const codsop = item.codsop;
        const detsopActual = (item.detsop || '').toString();
        const decsopActual = (item.decsop || '').toString();
        const estadoActual = (item.estado || 'ACTIVO').toString().toUpperCase();

        const html = `
        <div class="swal-form" style="text-align:left;display:grid;gap:14px">
            
            <div class="swal-field" style="display:grid;gap:6px">
            <label for="swal-detsop" style="font-weight:600;font-size:0.92rem">Nombre (detsop)</label>
            <input id="swal-detsop" 
                    class="swal2-input" 
                    style="margin:0;border-radius:10px;padding:10px 12px;font-size:0.95rem" 
                    value="${detsopActual.trim().replace(/"/g, '&quot;')}" 
                    maxlength="100" 
                    autocomplete="off">
            <small id="swal-detsop-count" style="color:#6c757d;font-size:0.82rem;display:flex;justify-content:space-between">
                Mín. 3, máx. 100 caracteres <span></span>
            </small>
            </div>
            
            <div class="swal-field" style="display:grid;gap:6px">
            <label for="swal-decsop" style="font-weight:600;font-size:0.92rem">Descripción (decsop)</label>
            <textarea id="swal-decsop" 
                        class="swal2-textarea" 
                        style="margin:0;border-radius:10px;padding:10px 12px;font-size:0.95rem;min-height:96px;resize:vertical" 
                        maxlength="1000">${decsopActual.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            <small id="swal-decsop-count" style="color:#6c757d;font-size:0.82rem;display:flex;justify-content:space-between">
                Opcional. Máx. 1000 caracteres <span></span>
            </small>
            </div>
            
            <div class="swal-field" style="display:grid;gap:6px">
            <label for="swal-estado" style="font-weight:600;font-size:0.92rem">Estado</label>
            <select id="swal-estado" 
                    class="swal2-select" 
                    style="width:100%;border-radius:10px;padding:10px 12px;font-size:0.95rem">
                <option value="ACTIVO" ${estadoActual === 'ACTIVO' ? 'selected' : ''}>ACTIVO</option>
                <option value="INACTIVO" ${estadoActual === 'INACTIVO' ? 'selected' : ''}>INACTIVO</option>
            </select>
            </div>
            
        </div>
`;



        const swalResult = await Swal.fire({
            title: 'Modificar soporte',
            html,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                const detsopInput = (document.getElementById('swal-detsop') as HTMLInputElement)?.value || '';
                const decsopInput = (document.getElementById('swal-decsop') as HTMLTextAreaElement)?.value || '';
                const estadoInput = (document.getElementById('swal-estado') as HTMLSelectElement)?.value || 'ACTIVO';

                const detsopNuevo = detsopInput.trim();
                const decsopNuevo = decsopInput.trim();
                const estadoNuevo = (estadoInput || 'ACTIVO').toUpperCase();

                // Validaciones básicas
                if (!detsopNuevo) {
                    Swal.showValidationMessage('El nombre (detsop) no puede estar vacío.');
                    return false;
                }
                if (detsopNuevo.length < 3) {
                    Swal.showValidationMessage('El nombre (detsop) debe tener al menos 3 caracteres.');
                    return false;
                }
                if (detsopNuevo.length > 100) {
                    Swal.showValidationMessage('El nombre (detsop) debe tener como máximo 100 caracteres.');
                    return false;
                }
                if (decsopNuevo.length > 1000) {
                    Swal.showValidationMessage('La descripción (decsop) no debe superar 1000 caracteres.');
                    return false;
                }
                if (detsopNuevo === detsopActual && decsopNuevo === decsopActual && estadoNuevo === estadoActual) {
                    Swal.showValidationMessage('No has cambiado ningún valor.');
                    return false;
                }

                try {
                    const payload = {
                        codsop,
                        detsop: detsopNuevo,
                        decsop: decsopNuevo,
                        estado: estadoNuevo
                    };
                    const resp = await firstValueFrom(this._teso112Service.update(payload));
                    if (!resp || resp.status !== 'success') {
                        throw new Error(resp?.message || 'No se pudo actualizar el soporte.');
                    }
                    return { resp, payload };
                } catch (err: any) {
                    Swal.showValidationMessage(err?.message || 'Error al actualizar.');
                    return false;
                }
            }
        });

        if (swalResult.isConfirmed && swalResult.value) {
            const { payload } = swalResult.value;
            await Swal.fire(
                'Actualizado',
                `Se actualizó el soporte ${codsop}.
                <br><b>Nombre:</b> ${detsopActual} → ${payload.detsop}
                <br><b>Estado:</b> ${estadoActual} → ${payload.estado}`,
                'success'
            );
            this.soportes1(); // refrescar tabla
        }
    }

    delete(v1: any) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: '¿Estas Seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this._teso112Service.delete(new Teso11(v1, '')).subscribe(
                    response => {
                        if (response.status == "success") {
                            this.status2 = response.status;
                            this.soportes1(); // refrescar lista
                        } else {
                            this.status2 = 'error';
                        }
                    }, error => {
                        this.status2 = 'error';
                        console.log(<any>error);
                    }
                );

                swalWithBootstrapButtons.fire(
                    'Eliminado!',
                    'El soporte ' + v1 + ' ha sido eliminado',
                    'success'
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'El Soporte ' + v1 + ' no ha sido eliminado',
                    'error'
                );
            }
        });
    }

    onSubmit(form: any) {
        Swal.fire({
            title: "¿Estas Seguro?",
            text: "Agregaras un nuevo Soporte",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'
        }).then(result => {
            if (result.value) {
                this._teso12Service.register(this.teso12).subscribe(response => {
                    if (response.status == "success") {
                        this.status = response.status;
                        form.resetForm(); // limpiar formulario
                        this.soportes1(); // refrescar tabla
                    } else {
                        this.status = 'error';
                    }
                }, error => {
                    this.status = 'error';
                });

                Swal.fire('Listo!', 'Soporte Agregado', 'success');
            } else {
                Swal.fire('Cancelado!', 'Soporte No Agregado', 'error');
            }
        });
    }

    // ===== Selección de filas =====
    selectedIds = new Set<number | string>();

    get selectedCount(): number {
        return this.selectedIds.size;
    }

    get allSelected(): boolean {
        return !!this.dataSoportes?.length && this.selectedIds.size === this.dataSoportes.length;
    }

    isSelected(id: number | string): boolean {
        return this.selectedIds.has(id);
    }

    toggleRow(id: number | string, ev: Event) {
        const checked = (ev.target as HTMLInputElement).checked;
        if (checked) this.selectedIds.add(id);
        else this.selectedIds.delete(id);
    }

    toggleAll(ev: Event) {
        const checked = (ev.target as HTMLInputElement).checked;
        this.selectedIds.clear();
        if (checked && this.dataSoportes?.length) {
            for (const row of this.dataSoportes) this.selectedIds.add(row.codsop);
        }
    }

    clearSelection() {
        this.selectedIds.clear();
    }

    // ===== Inactivar uno =====
    async inactivateOne(item: any) {
        const codsop = item.codsop;
        const nombre = (item.detsop || '').toString().trim();

        const result = await Swal.fire({
            title: 'Inactivar soporte',
            html: `¿Deseas inactivar el soporte <b>${nombre || codsop}</b>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, inactivar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                try {
                    // Reutiliza tu endpoint update para enviar estado=INACTIVO
                    const payload = { codsop, detsop: item.detsop, decsop: item.decsop, estado: 'INACTIVO' };
                    const resp = await firstValueFrom(this._teso112Service.update(payload));
                    if (!resp || resp.status !== 'success') {
                        throw new Error(resp?.message || 'No se pudo inactivar.');
                    }
                    return resp;
                } catch (err: any) {
                    Swal.showValidationMessage(err?.message || 'Error al inactivar.');
                    return false;
                }
            }
        });

        if (result.isConfirmed) {
            await Swal.fire('Listo', 'Soporte inactivado', 'success');
            this.soportes1();
        }
    }

    // ===== Inactivar seleccionados (masivo) =====
    async inactivateSelected() {
        if (!this.selectedIds.size) return;

        const ids = Array.from(this.selectedIds);

        const result = await Swal.fire({
            title: 'Inactivar seleccionados',
            html: `Vas a inactivar <b>${ids.length}</b> soporte(s). ¿Continuar?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, inactivar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                try {
                    // Si no tienes endpoint batch, llama uno a uno (fallback).
                    // Idealmente, implementa un endpoint batch en el servicio.
                    // ---- Opción A: endpoint batch (recomendado) ----
                    if (this._teso112Service.inactivateMany) {
                        const resp = await firstValueFrom(this._teso112Service.inactivateMany({ ids, estado: 'INACTIVO' }));
                        if (!resp || resp.status !== 'success') {
                            throw new Error(resp?.message || 'No se pudo inactivar.');
                        }
                        return resp;
                    }
                    // ---- Opción B: fallback uno a uno ----
                    for (const id of ids) {
                        const row = this.dataSoportes.find((r: any) => r.codsop === id);
                        const payload = { codsop: id, detsop: row?.detsop, decsop: row?.decsop, estado: 'INACTIVO' };
                        const resp = await firstValueFrom(this._teso112Service.update(payload));
                        if (!resp || resp.status !== 'success') {
                            throw new Error(resp?.message || `Error inactivando ${id}`);
                        }
                    }
                    return { status: 'success' };
                } catch (err: any) {
                    Swal.showValidationMessage(err?.message || 'Error al inactivar.');
                    return false;
                }
            }
        });

        if (result.isConfirmed) {
            this.clearSelection();
            await Swal.fire('Listo', 'Soportes inactivados', 'success');
            this.soportes1();
        }
    }


    async activateOne(item: any) {
        const codsop = item.codsop;
        const nombre = (item.detsop || '').toString().trim();

        const result = await Swal.fire({
            title: 'Activar soporte',
            html: `¿Deseas activar el soporte <b>${nombre || codsop}</b>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                try {
                    const payload = {
                        codsop,
                        detsop: item.detsop,
                        decsop: item.decsop,
                        estado: 'ACTIVO'
                    };
                    const resp = await firstValueFrom(this._teso112Service.update(payload));
                    if (!resp || resp.status !== 'success') {
                        throw new Error(resp?.message || 'No se pudo activar.');
                    }
                    return resp;
                } catch (err: any) {
                    Swal.showValidationMessage(err?.message || 'Error al activar.');
                    return false;
                }
            }
        });

        if (result.isConfirmed) {
            await Swal.fire('Listo', 'Soporte activado', 'success');
            this.soportes1(); // refresca tabla
        }
    }

    get showInactivateButton(): boolean {
        if (!this.selectedIds.size) return false;
        const seleccionados = this.dataSoportes.filter((r: any) => this.selectedIds.has(r.codsop));
        // todos están ACTIVO → puedo inactivar
        return seleccionados.every((r: any) => r.estado === 'ACTIVO');
    }

    get showActivateButton(): boolean {
        if (!this.selectedIds.size) return false;
        const seleccionados = this.dataSoportes.filter((r: any) => this.selectedIds.has(r.codsop));
        // todos están INACTIVO → puedo activar
        // o mezcla de ACTIVO e INACTIVO → mostrar activar
        return seleccionados.every((r: any) => r.estado === 'INACTIVO')
            || seleccionados.some((r: any) => r.estado === 'INACTIVO');
    }

    async activateSelected() {
        if (!this.selectedIds.size) return;

        const ids = Array.from(this.selectedIds);

        const result = await Swal.fire({
            title: 'Activar seleccionados',
            html: `Vas a activar <b>${ids.length}</b> soporte(s). ¿Continuar?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                try {
                    for (const id of ids) {
                        const row = this.dataSoportes.find((r: any) => r.codsop === id);
                        const payload = { codsop: id, detsop: row?.detsop, decsop: row?.decsop, estado: 'ACTIVO' };
                        const resp = await firstValueFrom(this._teso112Service.update(payload));
                        if (!resp || resp.status !== 'success') {
                            throw new Error(resp?.message || `Error activando ${id}`);
                        }
                    }
                    return { status: 'success' };
                } catch (err: any) {
                    Swal.showValidationMessage(err?.message || 'Error al activar.');
                    return false;
                }
            }
        });

        if (result.isConfirmed) {
            this.clearSelection();
            await Swal.fire('Listo', 'Soportes activados', 'success');
            this.soportes1();
        }
    }





}

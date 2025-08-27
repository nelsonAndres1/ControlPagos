import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'estadoFiltro'
})
export class EstadoFiltroPipe implements PipeTransform {
    transform(data: any[], estado: 'TODOS' | 'ACTIVO' | 'INACTIVO'): any[] {
        if (!data) return [];
        if (estado === 'TODOS') return data;
        return data.filter(item => (item.estado || '').toUpperCase() === estado);
    }
}

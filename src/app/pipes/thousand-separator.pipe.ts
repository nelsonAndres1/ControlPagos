import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'thousandSeparator'
})
export class ThousandSeparatorPipe implements PipeTransform {
    transform(value: string | number): string {
        if (!value) return '';
        const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
        return num.toLocaleString('es-ES'); // Cambia 'es-ES' según el formato regional
    }
}

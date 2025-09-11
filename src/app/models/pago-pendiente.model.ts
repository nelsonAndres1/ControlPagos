export interface PagoPendiente {
    codclas: string;
    numero: string;
    estado_actual_txt: string;
    nombre_estado_actual: string;
    flujo: string;
    prioridad: 'A' | 'B' | 'M' | string;
    detclas: string;
}
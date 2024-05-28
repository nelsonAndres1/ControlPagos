export interface Proceso {
    id: number;
    nombre: string;
    hijos?: Proceso[]; // Subprocesos
}

import { Injectable } from '@angular/core';
import { Proceso } from '../teso21/proceso.interface';

@Injectable({
    providedIn: 'root'
})
export class ProcesoService {
    procesos: Proceso[] = [
        {
            id: 1,
            nombre: 'Proceso Principal',
            hijos: [
                {
                    id: 2,
                    nombre: 'Subproceso 1'
                },
                {
                    id: 3,
                    nombre: 'Subproceso 2',
                    hijos: [
                        {
                            id: 4,
                            nombre: 'Subproceso 2.1'
                        },
                        {
                            id: 5,
                            nombre: 'Subproceso 2.2'
                        }
                    ]
                }
            ]
        }
    ];

    constructor() { }
}

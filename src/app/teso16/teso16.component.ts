import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Teso15Service } from '../services/teso15.service';
import { Teso13Service } from '../services/teso13.service';
import { Teso14Service } from '../services/teso14.service';
import { Teso20Service } from '../services/teso20.service';

// >>> idéntico a tu otro componente:
import { Teso117Service } from '../services/teso117.service';
import { global } from '../services/global';

import { Gener02 } from '../models/gener02';
import { Teso113 } from '../models/teso113';
import { Estado } from '../models/estado';

@Component({
  selector: 'app-teso16',
  templateUrl: './teso16.component.html',
  styleUrls: ['./teso16.component.css'],
  providers: [
    Teso15Service,
    Teso13Service,
    Teso14Service,
    Teso20Service,
    Teso117Service // <<< agregamos el servicio donde ya usas traerSoportes()
  ]
})
export class Teso16Component implements OnInit {

  itemDetail: any = [];
  item1: any = [];
  item2: any = [];

  public status: any;
  public token: any;
  public identity: any;
  public identity1: any;
  public identity12: any;

  v: any = true;
  public arrayN = Array();
  public data: any = '';

  public estado: Estado;
  estadosMap: { [key: string]: string } = {};

  // Soportes (métodos idénticos a tu otro flujo)
  soportes: any[] = [];
  cargandoSoportes = false;
  visorAbierto = false;
  soporteSeleccionado: any = null;

  global_url = global.url;

  constructor(
    private route: ActivatedRoute,
    private _teso15Service: Teso15Service,
    private _route: Router,
    private _teso13Service: Teso13Service,
    private _teso14Service: Teso14Service,
    private _teso20Service: Teso20Service,

    // <<< mismo servicio que usas donde ya funciona:
    private _teso117Service: Teso117Service
  ) {
    this.estado = new Estado('', '');

    this.route.queryParams.subscribe(response => {
      const paramsData = JSON.parse(response['res2']);
      this.itemDetail = paramsData;
      this.item1 = this.itemDetail[0];
      this.item2 = this.itemDetail[1][0];

      // Prefetch nombres de usuarios
      for (let index = 0; index < this.item1.length; index++) {
        this.getUsuario(this.item1[index]['usuario']);
      }

      // Carga datos del pago y luego soportes (mismo patrón que ya usas)
      this.data = this.getAllTeso13(this.item1[0]['codclas'], this.item1[0]['numero']);

      // Mapea estados legibles
      this.prepararEstados();
    });
  }

  ngOnInit(): void { }

  getAllTeso13(codclas: any, numero: any) {
    this._teso15Service.getAllTeso13(new Teso113(codclas, numero)).subscribe(response => {
      this.data = response;
      // Traer soportes con el MISMO método / servicio que ya tienes en el otro componente:
      this.traerSoportes();
    });
    return this.data;
  }

  // ============== SOPORTES: mismos métodos que ya usas ==============

  traerSoportes() {
    this.cargandoSoportes = true;

    // tu otro componente usa: this._teso117Service.traerSoportes(this.data)
    this._teso117Service.traerSoportes(this.data).subscribe(
      (response) => {
        this.soportes = Array.isArray(response) ? response : [];
        this.cargandoSoportes = false;
      },
      (err) => {
        console.error('Error cargando soportes:', err);
        this.soportes = [];
        this.cargandoSoportes = false;
      }
    );
  }

  verPDF(so: any) {
    // Igual que allá: usar la URL pública de teso12/getDocumento/<archivo>
    // Aquí solo seleccionamos cuál mostrar en el visor
    this.soporteSeleccionado = so;
    this.visorAbierto = true;
  }

  downloadPDF(so: any) {
    const url = this.global_url + 'teso12/getDocumento/' + so.archivo;

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const tmp = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = tmp;
        a.download = so.archivo || 'documento.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(tmp);
        a.remove();
      })
      .catch(error => {
        console.error('Error al descargar el archivo:', error);
        Swal.fire('Error', 'No se pudo descargar el documento.', 'error');
      });
  }

  toggleVisor() {
    this.visorAbierto = !this.visorAbierto;
    if (!this.visorAbierto) {
      this.soporteSeleccionado = null;
    }
  }

  // ================== ESTADOS ==================

  prepararEstados() {
    if (!Array.isArray(this.item1)) return;

    this.item1.forEach((r) => {
      if (!r?.estado) return;

      if (r.estado === 'RA') {
        this.estadosMap[r.estado] = 'Radicado';
      } else {
        this._teso20Service.getOne({ estado: r.estado }).subscribe(
          (response) => {
            this.estadosMap[r.estado] = response?.estado || r.estado;
          },
          (error) => {
            console.error('Error al obtener el estado:', error);
          }
        );
      }
    });
  }

  obtenerNombreEstado(estado: string): string {
    return this.estadosMap[estado] || (estado === 'RA' ? 'Radicado' : 'Desconocido');
  }

  // ================== USUARIOS ==================

  nombreUsuario(user: any) {
    for (let index = 0; index < this.arrayN.length; index++) {
      if (this.arrayN[index] == user) {
        Swal.fire('Usuario encontrado', this.arrayN[index + 1], 'info');
        break;
      }
    }
  }

  getUsuario(user: any) {
    this._teso15Service.getUsuario(new Gener02(user, '')).subscribe(
      response => {
        if (response.status != 'error') {
          this.status != 'success';
          this.token = response;

          this._teso15Service.getUsuario(new Gener02(user, ''), this.v).subscribe(
            response => {
              this.identity = response;
              this.identity1 = this.identity?.[0]?.['nombre'];
              this.identity12 = this.identity?.[0]?.['usuario'];
              this.arrayN.push(this.identity12, this.identity1);
            },
            error => {
              this.status = 'error';
            }
          );
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}

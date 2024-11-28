import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Teso15Service } from '../services/teso15.service';
import { Gener02 } from '../models/gener02';
import { Teso13Service } from '../services/teso13.service';
import { Teso14Service } from '../services/teso14.service';
import { Teso113 } from '../models/teso113';
import { Teso20Service } from '../services/teso20.service';
import { Estado } from '../models/estado';

@Component({
  selector: 'app-teso16',
  templateUrl: './teso16.component.html',
  styleUrls: ['./teso16.component.css'],
  providers: [Teso15Service, Teso13Service, Teso14Service, Teso20Service]
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
  public soportes_subidos: any = [];
  v: any = true;
  public arrayN = Array();
  public data: any = '';
  public estado: Estado;
  estadosMap: { [key: string]: string } = {};
  
  constructor(private route: ActivatedRoute, private _teso15Service: Teso15Service, private _route: Router, private _teso13Service: Teso13Service, private _teso14Service: Teso14Service, private _teso20Service: Teso20Service) {
    this.estado = new Estado('', '');
    this.route.queryParams.subscribe(response => {
      const paramsData = JSON.parse(response['res2']);
      this.itemDetail = paramsData;
      this.item1 = this.itemDetail[0];
      this.item2 = this.itemDetail[1][0];

      for (let index = 0; index < this.item1.length; index++) {
        this.item1[index]['usuario'];
        this.getUsuario(this.item1[index]['usuario']);
        this.arrayN;
      }
      this.data = this.getAllTeso13(this.item1[0]['codclas'], this.item1[0]['numero']);
    })
    this.prepararEstados();

  }
  getAllTeso13(codclas: any, numero: any) {
    this._teso15Service.getAllTeso13(new Teso113(codclas, numero)).subscribe(response => {
      this.data = response;
      console.log('jjjj');
      console.log(this.data);
    });
    return this.data;
  }

  ngOnInit(): void { }

  cambioEstadoNombre(estado: any) {
    var estadoEscr = '';
    if (estado == 'RA') {
      estadoEscr = 'Radicado';    return estadoEscr;
    } else {
      this.estado.estado = estado;
      this._teso20Service.getOne(this.estado).subscribe(
        response => {
          console.log("holaa>!>");
          console.log(response);
          estadoEscr = response.estado;
          
        }
      )
      return estadoEscr;
    }
  }



  prepararEstados() {
    this.item1.forEach((r) => {
      if (r.estado === 'RA') {
        this.estadosMap[r.estado] = 'Radicado';
      } else {
        this._teso20Service.getOne({ estado: r.estado }).subscribe(
          (response) => {
            this.estadosMap[r.estado] = response.estado;
          },
          (error) => {
            console.error('Error al obtener el estado:', error);
          }
        );
      }
    });
  }

  obtenerNombreEstado(estado: string): string {
    return this.estadosMap[estado] || 'Desconocido';
  }



  downloadFile(array: any) {
    console.log(array.archivo)
    const fileName = "prueba.pdf";
    this._teso13Service.downloadFile(array.archivo).subscribe(
      response => {
        this.managePdfFile(response, fileName);
      }, error => {
      }
    )
  }
  managePdfFile(response: any, fileName: string): void {
    const datatype = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(new Blob(binaryData, { type: datatype }));
    const downloadLike = document.createElement('a');
    downloadLike.href = filtePath;
    downloadLike.setAttribute('download', fileName);
    document.body.appendChild(downloadLike);
    downloadLike.click();
  }


  nombreUsuario(user: any) {

    for (let index = 0; index < this.arrayN.length; index++) {
      if (this.arrayN[index] == user) {
        this.arrayN[index];
        this.arrayN[index + 1];
        Swal.fire(
          'Usuario encontrado',
          this.arrayN[index + 1],
          'info'
        )
        break;
      } else {

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
              this.identity;
              this.identity1 = this.identity[0]['nombre'];
              this.identity12 = this.identity[0]['usuario'];
              this.identity[0]['nombre'];
              this.identity[0]['usuario'];

              this.arrayN.push(this.identity[0]['usuario'], this.identity[0]['nombre']);
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
      });
  }



}

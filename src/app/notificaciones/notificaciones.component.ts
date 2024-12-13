import { Component } from '@angular/core';
import { Teso18Service } from '../services/teso18.service';
import { Notificacion } from '../models/notificacion';
import { Teso10Service } from '../services/teso10.service';
import { Teso20Service } from '../services/teso20.service';
import { Teso24Service } from '../services/teso24.service';
import { Gener02Service } from '../services/gener02.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  providers: [Teso18Service, Teso10Service, Teso20Service, Teso24Service]
})
export class NotificacionesComponent {

  identity: any;
  usuarios: any = [];
  notificacion: Notificacion;
  pagos: any;
  data_teso20: any = [];

  constructor(private _teso18Service: Teso18Service,
    private _teso10Service: Teso10Service,
    private _teso20Service: Teso20Service,
    private _teso24Service: Teso24Service,
    private _gener02Service: Gener02Service) {

    this.identity = this._gener02Service.getIdentity();
    this.notificacion = new Notificacion('', '', '', '', '', this.identity.sub);
    this.allTeso20();
    this.getPagos();
    this.getNotificacion();

  }
  onSubmit(form) {
    console.log("form!");
    console.log(this.notificacion);

    this._teso24Service.register(this.notificacion).subscribe(
      response =>{
        console.log(response);
      }
    )



  }

  getPagos() {
    this._teso10Service.getPagos({}).subscribe(
      response => {
        this.pagos = response.data;
      }
    )
  }


  getNotificacion(){
    this._teso24Service.getNotificacion({}).subscribe(
      response => {
        console.log(response)
      }
    )
  }


  agregar(dt) {
    this.notificacion.usuario = dt.usuario
    this.notificacion.nombre = dt.nombre
    this.usuarios = []
  }


  input(event) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      this.usuarios = []
    } else {
      const search = this._teso18Service.getUsers(keyword).then(response => {
        this.usuarios = response;
        console.log(this.usuarios);
      });
    }
  }


  allTeso20() {
    this._teso20Service.getAll({}).subscribe(
      response => {
        this.data_teso20 = response;
        console.log(this.data_teso20);
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }
}

import { Component } from '@angular/core';
import { Teso23 } from '../models/teso23';
import { Teso23Service } from '../services/teso23.service';
import { Teso20Service } from '../services/teso20.service';
import { Gener02Service } from '../services/gener02.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teso23',
  templateUrl: './teso23.component.html',
  styleUrls: ['./teso23.component.css'],
  providers: [Teso23Service, Teso20Service, Gener02Service]
})
export class Teso23Component {

  teso23: Teso23;
  data_teso20: any = [];
  info_usuario: any = [];
  identity: any;
  usuarios:any = [];

  constructor(private _teso23Service: Teso23Service, private _Teso20Service: Teso20Service, private _gener02Service: Gener02Service) {
    this.identity = this._gener02Service.getIdentity();
    this.teso23 = new Teso23('', '', '', '', '', '');
    this.teso23.usuario = this.identity.sub;
    this.allTeso20()
    this.getAllUsuario();
  }


  allTeso20() {
    this._Teso20Service.getAll({}).subscribe(
      response => {
        console.log("response!!!!");
        console.log(response);
        this.data_teso20 = response;
      }
    )
  }


  getAllUsuario(){
    this._teso23Service.getAllUsuario({}).subscribe(
      response =>{
        console.log("resss!");
        console.log(response)
        this.usuarios = response;
      }
    )
  }

  getUser() {
    this._gener02Service.getUsuario(this.teso23).subscribe(
      response => {
        console.log("ejemplo!!!!");
        console.log(response);
        this.info_usuario = response;
      }
    )
  }

  eliminar(dt){

    Swal.fire({
      title: "¿Esta seguro de eliminar este registro?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {

        this._teso23Service.delete(dt).subscribe(
          response =>{
            if(response.status == 'success'){
              Swal.fire("Cambios guardados", "", "success").then(()=>{
                this.getAllUsuario()
              });      
            }else{
              Swal.fire("Cambios NO guardados", "", "error");      
            }
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Cambios NO guardados", "", "warning");      
      }
    });





  }


  registerPermisos(form) {

    this._teso23Service.save(this.teso23).subscribe(
      response => {

        if (response.code == 200) {
          Swal.fire({
            title: "Información!",
            text: "Datos Guardados!",
            icon: "success"
          }).then(()=>{
            this.getAllUsuario()
          });      
        }else if(response.code == 300){
          Swal.fire({
            title: "Información!",
            text: "Permiso ya existe!",
            icon: "warning"
          });
        }else if(response.code == 400){
          Swal.fire({
            title: "Información!",
            text: "Error al guardar!",
            icon: "error"
          });
        }
      }
    )

  }

}

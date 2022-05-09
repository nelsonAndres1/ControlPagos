import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { Teso16Service } from '../services/teso16.service';
import { Gener02 } from '../models/gener02';
import { Teso16 } from '../models/teso16';
import { identity } from 'rxjs';
@Component({
  selector: 'app-teso118',
  templateUrl: './teso118.component.html',
  styleUrls: ['./teso118.component.css']
})
export class Teso118Component implements OnInit {
  itemDetail:any=[];
  array : any = [];
  status : any = [];
  data:any;
  arrayP : any = [];
  constructor(private route : ActivatedRoute, private _route : Router, private _teso16Service : Teso16Service) {

    this.route.queryParams.subscribe(response =>{
      const paramsData =  JSON.parse(response['result']);
      this.itemDetail = paramsData;
      
    })
    this.listarTeso16(this.itemDetail['usuario']);
   }

  ngOnInit(): void {
  }

  tipoPermisos(permisos : any){

    if(permisos=='AD'){
      Swal.fire('Permiso','Administrador','info');
    }
    if(permisos=='RA'){
      Swal.fire('Permiso','Radicación','info');
    }
    if(permisos=='RV'){
      Swal.fire('Permiso','Revisión','info');
    }
    if(permisos=='AU'){
      Swal.fire('Permiso','Autorizado','info');
    }
    if(permisos=='FI'){
      Swal.fire('Permiso','Financiera','info');
    }
    if(permisos=='CT'){
      Swal.fire('Permiso','Causación','info');
    }
    if(permisos=='PC'){
      Swal.fire('Permiso','Causación Pago','info');
    }
    if(permisos=='RT'){
      Swal.fire('Permiso','Revision Tesoreria','info');
    }
    if(permisos=='RP'){
      Swal.fire('Permiso','Radicación Pago','info');
    }
    if(permisos=='P'){
      Swal.fire('Permiso','Pago','info');
    }

  }



  listarTeso16(user : any){
    const teso16 = this._teso16Service.listarTeso16(new Gener02(user,'')).subscribe(
      response=>{
        this.data = response;
      });
  }
  submit() {
    if (this.array.length > 0) {
        Swal.fire({
            title: "¿Estas Seguro?",
            text: "¡Eliminaras Permisos a " + this.itemDetail.nombre + "!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4BB543',
            cancelButtonColor: '#EA1737',
            confirmButtonText: 'Iniciar'
        }).then(result => {
            if (result.value) {
                for (let index = 0; index < this.array.length; index++) {
                    this._teso16Service.deleteTeso16(new Teso16(this.itemDetail.usuario,this.array[index])).subscribe(response => {
                        if (response.status == "success") {
                            this.status = response.status;
                        } else {
                            this.status = 'error';
                        }
                    }, error => {
                        this.status = 'error';
                        console.log(< any > error);
                    });
                }
                Swal.fire('Listo!', 'Permiso(s) Eliminados(s)', 'success');
            
                this._route.navigate(['teso1117']);
                
            } else {
                Swal.fire('Cancelado!', 'Permiso(s) No Eliminados(s)', 'error');
            }
        });
    } else {
        Swal.fire('¡Error!', 'No ha seleccionado ningun permiso', 'error');
    }
}

  onChange($event, result : any){
    var bandera = false;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        result: JSON.stringify(result)
      }
    }

    const isChecked = $event.target.checked;

    if(isChecked == true){
      if(this.array.length>0){
        for (let index = 0; index <= this.array.length; index++) {
          if(this.array[index]==result){
            bandera = true;
          }
        }
        if(bandera != true){
          this.array.push(result);
        }
      }else{
        this.array.push(result);
      }
    }else{
      for (let index = 0; index <= this.array.length; index++) {
        if(this.array[index]==result){
          this.array.splice(index,1);
        }
        
      }
    }
  }
}

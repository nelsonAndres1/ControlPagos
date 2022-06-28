import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { teso10 } from "../models/teso10";
import { Teso14 } from '../models/teso14';
import { Teso14Service } from '../services/teso14.service';
import { Teso114Service } from '../services/teso114.service';
import { Teso10Service } from '../services/teso10.service';
import { Router, ActivatedRoute ,NavigationExtras } from '@angular/router';
import { identity } from 'rxjs';
@Component({
  selector: 'app-teso18',
  templateUrl: './teso18.component.html',
  styleUrls: ['./teso18.component.css']
})
export class Teso18Component implements OnInit {
  data: any;
  public teso10;
  public status: any;
  public token: any;
  public v:any=true;
  public identity : any;
  constructor(
    private service: Teso14Service, 
    private _teso14Service: Teso14Service,
    private router:Router,
    private _teso10Service: Teso10Service

  ) { 
    this.teso10 = new teso10('','','','');
    this.datosTabla();
  }

  ngOnInit(): void {
  }
  getTPagos(pclave: any){
    const keyword = pclave.target.value;
    const search = this.service.getTPago(keyword).then(
      response => {
        this.data = response;
     
      });
  }
  datosTabla(){
    this._teso10Service.signup2(this.teso10).subscribe(
      response =>{
        if(response.status != 'error'){
         
          this.token = response;
          this._teso10Service.signup2(this.teso10,this.v).subscribe(
            response => {
              this.identity = response;
              this.token;
              this.identity;
            },
            error =>{
         
              console.log(<any>error);
            }
          );
        }else{
         console.log("erroror");
        }
      },
      error =>{
        console.log(<any>error);
      }
    );
  }
  getDetailPage(result:any){
   
    const navigationExtras: NavigationExtras = {
      queryParams:  {
        result: JSON.stringify(result)
      }

    }
    this.router.navigate(['teso1118'], navigationExtras);
  }

}

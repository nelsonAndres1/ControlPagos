import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import Swal from 'sweetalert2';
import {Teso15Service} from '../services/teso15.service';
import { Gener02 } from '../models/gener02';

@Component({selector: 'app-teso16', 
            templateUrl: './teso16.component.html', 
            styleUrls: ['./teso16.component.css'], 
            providers: [Teso15Service]
          })
export class Teso16Component implements OnInit {

    itemDetail : any = [];
    item1 : any = [];
    item2 : any = [];
    public status : any;
    public token : any;
    public identity:any;
    public identity1:any;
    public identity12:any;
    v : any = true;
    public arrayN = Array();
    
    constructor(private route : ActivatedRoute, private _teso15Service : Teso15Service) {
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
        })

    }

    ngOnInit(): void {}


    nombreUsuario(user: any){

        for (let index = 0; index < this.arrayN.length; index++) {
          if(this.arrayN[index]==user){
            this.arrayN[index];
            this.arrayN[index+1];
            Swal.fire(
              'Usuario encontrado',
              this.arrayN[index+1],
              'info'
            )
            break;
          }else{

          }
        }
    } 


    getUsuario(user : any) {
       
      this._teso15Service.getUsuario(new Gener02(user, '')).subscribe(
        response => {
          if(response.status != 'error'){
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
                
                this.arrayN.push(this.identity[0]['usuario'],this.identity[0]['nombre']);
              },
              error => {
                this.status = 'error';
                console.log(<any>error);
              }
            );

          }else{
            this.status = 'error';
          }
        },
        error=>{
          this.status = 'error';
          console.log(<any>error);
        });
    }

}

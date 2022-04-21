import { Component, OnInit } from '@angular/core';
import { Teso15Service } from '../services/teso15.service';
import { Teso15 } from '../models/teso15';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-teso17',
  templateUrl: './teso17.component.html',
  styleUrls: ['./teso17.component.css'],
  providers:[Teso15Service]
})
export class Teso17Component implements OnInit {
  data: any;
  data1: any;
  query: string;
  

  constructor(
    private _teso15Service: Teso15Service,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  getTpago(pclave: any){
    const keyword = pclave.target.value;
    if(keyword.length==10){
      const search = this._teso15Service.getTPago(keyword).then(
        response => {
          this.data= response[1];
          this.data1 = response;

        },
        error=>{
          console.log("No encontrado");
        }
      )
    }else{
      console.log("Datos No corresponden");
    }
  }

  getDetailPage(result: any, data: any){
    var res: any;
    var res2: any;

    const navigationExtras: NavigationExtras = {
      queryParams: {

        res2: JSON.stringify(data)
      }
    }
    console.log('2');
    console.log(res2);
    this.router.navigate(['teso117'], navigationExtras);
  }
}

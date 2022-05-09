import { Component, OnInit } from '@angular/core';
import { Teso15Service } from '../services/teso15.service';
import { Teso15 } from '../models/teso15';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { identity } from 'rxjs';
@Component({
  selector: 'app-teso15',
  templateUrl: './teso15.component.html',
  styleUrls: ['./teso15.component.css'],
  providers: [Teso15Service]
})
export class Teso15Component implements OnInit {
  data: any;
  data1: any;
  /* current_clien = Teso15; */ 
  query: string = '';
  

  constructor(
    private _teso15Service: Teso15Service,
    private router: Router
  ) {
    if(identity != null){
      this.router.navigate(['login']);
    }else{
      
    }
   }

  ngOnInit(): void {


  }
  getTpago(pclave: any){
    const keyword = pclave.target.value;
    if(keyword.length==10){
      const search = this._teso15Service.getTPago(keyword).then(
        response => {
          this.data = response[1];
          this.data1 = response;

   
        },
        error=>{
          
        }
        )
    }else{
     
    }
  }

  getDetailPage(result:any, data: any){
    var res: any;
    var res2: any;
    const navigationExtras: NavigationExtras = {
      queryParams: {

        res2: JSON.stringify(data)
      }
    }

    console.log('2');
    console.log(res2);
    this.router.navigate(['teso16'], navigationExtras);
  }

}

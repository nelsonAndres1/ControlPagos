import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Teso16Service } from '../services/teso16.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { identity } from 'rxjs';
@Component({
  selector: 'app-teso116',
  templateUrl: './teso116.component.html',
  styleUrls: ['./teso116.component.css'],
  providers: [Teso16Service]
})
export class Teso116Component implements OnInit {

  data : any;
  constructor(
    private _teso16Service : Teso16Service,
    private router: Router) {
     }

  ngOnInit(): void {
  }
  

  getUsuarios(pclave : any){
    const keyword = pclave.target.value;
    const search = this._teso16Service.getUsuarios(keyword).then(response => {
      this.data = response
    })
  }
  getDetailPage(result : any){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        result : JSON.stringify(result)
      }
     
     }
     this.router.navigate(['teso1116'], navigationExtras);
  }


}

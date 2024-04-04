import { Component, OnInit } from '@angular/core';
import { Teso16Service } from '../services/teso16.service';
import { NavigationExtras, Router } from '@angular/router';
import { identity } from 'rxjs';

@Component({
  selector: 'app-teso1117',
  templateUrl: './teso1117.component.html',
  styleUrls: ['./teso1117.component.css'],
  providers: [Teso16Service]
})
export class Teso1117Component implements OnInit {

  data: any;
  constructor(private _teso16Service: Teso16Service, private router: Router) {

  }

  ngOnInit(): void {
  }
  getUsuarios(pclave: any) {
    const keyword = pclave.target.value;
    const search = this._teso16Service.getUsuarios(keyword).then(response => {
      this.data = response
    })
  }
  getDetailPage(result: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        result: JSON.stringify(result)
      }
    }
    this.router.navigate(['teso118'], navigationExtras);
  }

}

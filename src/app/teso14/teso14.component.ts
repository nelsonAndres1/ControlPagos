import { Component, OnInit } from '@angular/core';
import { teso10 } from "../models/teso10";
import { Teso14Service } from '../services/teso14.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-teso14',
  templateUrl: './teso14.component.html',
  styleUrls: ['./teso14.component.css']
})
export class Teso14Component implements OnInit {

  data: any;
  public teso10;
  public status: any;
  public token: any;
  public v: any = true;

  constructor(
    private service: Teso14Service,
    private _teso14Service: Teso14Service,
    private router: Router
  ) {

    this.teso10 = new teso10('', '', '', '', '', '');
  }

  ngOnInit(): void {

  }

  getTPagos(pclave: any) {

    const keyword = pclave.target.value;
    const search = this.service.getTPago(keyword).then(
      response => {
        this.data = response;

      });

  }
  getDetailPage(result: any) {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        result: JSON.stringify(result)
      }

    }
    this.router.navigate(['teso114'], navigationExtras);
  }
}

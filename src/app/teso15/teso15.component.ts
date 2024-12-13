import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  data: any;
  data1: any;
  query: string = '';


  constructor(
    private _teso15Service: Teso15Service,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.focusSearchInput();
  }

  focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  getTpago(pclave: any) {
    const keyword = pclave.target.value;
    if (keyword.length == 10) {
      const search = this._teso15Service.getTPago(keyword).then(
        response => {
          console.log("data");
          console.log(response[1])
          console.log(response)
          this.data = response[1];
          this.data1 = response;


        },
        error => {

        }
      )
    } else {

    }
  }

  getDetailPage(result: any, data: any) {
    var res: any;
    var res2: any;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        res2: JSON.stringify(data)
      }
    }
    this.router.navigate(['teso16'], navigationExtras);
  }

}

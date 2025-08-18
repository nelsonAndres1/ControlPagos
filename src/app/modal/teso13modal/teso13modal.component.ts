import { Component } from '@angular/core';
import { Teso13 } from 'src/app/models/teso13';
import { Teso13Service } from 'src/app/services/teso13.service';
import { Router, NavigationExtras } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-teso13modal',
  templateUrl: './teso13modal.component.html',
  styleUrls: ['./teso13modal.component.css'],
  providers: [Teso13Service, SharedService]
})
export class Teso13modalComponent {

  dataSubscription: Subscription;
  receivedData: any;
  teso13: Teso13;
  centroCostos = false;
  codcen_nombre: any;
  coddep_nombre: any;
  data: any;
  bandera: any;
  data_keyword: any = { data: '', codcen: '' }
  datac28: any;
  bandera28: any;


  constructor(private _teso13Service: Teso13Service, private sharedService: SharedService) {
    this.dataSubscription = this.sharedService.data$.subscribe(data => {
      this.receivedData = data;
      console.log("data!!!!");
      console.log(this.receivedData);
    });

    this.teso13 = new Teso13('', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', '', "", null, '', '', '0','','','','');
  }

  onSubmit(form) {

  }


  centroC() {

    console.log("atuda!")
    console.log(this.receivedData)


    if (this.centroCostos == true) {
      this.teso13.codcen = ''
      this.codcen_nombre = '';
      this.centroCostos = false;
      this.teso13.coddep = '';
      this.coddep_nombre = '';
    } else {
      this.teso13.codcen = '0000'
      this.codcen_nombre = 'VARIOS';
      this.centroCostos = true;
      this.teso13.coddep = '000000';
      this.coddep_nombre = 'VARIOS';
    }
  }

  getConta(pclave: any) {
    const keyword = pclave.target.value;
    const search = this._teso13Service.getConta06(keyword).then(response => {
      this.data = response;
      this.data;
    });
    this.bandera = 'true';
  }

  getDetailPage(result: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        result: JSON.stringify(result)
      }
    }
  }

  touchCC(result: any) {
    console.log(result.codcen);
    this.teso13.codcen = result.codcen;
    this.bandera = 'false';
    this.codcen_nombre = result.detalle;
  }


  getConta28(pclave: any) {

    this.data_keyword.data = pclave.target.value;
    this.data_keyword.codcen = this.teso13.codcen;
    const search = this._teso13Service.getConta28(this.data_keyword).subscribe(response => {
      this.datac28 = response;
      this.datac28;
    });
    this.bandera28 = 'true';
  }

  getDetailPageC28(resultC2: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        resultC2: JSON.stringify(resultC2)
      }
    }
  }
  touch28(result: any) {
    this.teso13.coddep = result.coddep;
    this.bandera28 = 'false';
    this.coddep_nombre = result.detalle;
  }
}

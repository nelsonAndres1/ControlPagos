import { Component, OnInit } from '@angular/core';
import { Reporte } from '../models/reporte';
import { Teso10Service } from '../services/teso10.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [Teso10Service]
})
export class ReportesComponent implements OnInit {
  reporte: Reporte;
  teso10: any = []
  constructor(private _teso10Service: Teso10Service) {
    this.reporte = new Reporte('', '', '', '');
    this._teso10Service.signup(this.reporte).subscribe(
      response => {
        this.teso10 = response;
      }
    );
  }

  ngOnInit(): void {
  }
  registerReportes(form) {

  }
}

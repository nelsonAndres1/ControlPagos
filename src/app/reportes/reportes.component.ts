import { Component, OnInit } from '@angular/core';
import { Reporte } from '../models/reporte';
import { Teso10Service } from '../services/teso10.service';
import { ReporteService } from '../services/reporte.service';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [Teso10Service, ReporteService]
})
export class ReportesComponent implements OnInit {
  reporte: Reporte;
  teso10: any = []

  constructor(private _teso10Service: Teso10Service, private _reporteService: ReporteService) {
    this.reporte = new Reporte('-', '-', '-', '-');
    this._teso10Service.signup(this.reporte).subscribe(
      response => {
        this.teso10 = response;
        console.log("teso10");
        console.log(this.teso10);
      }
    );
  }

  ngOnInit(): void {
  }
  registerReportes(form) {
    console.log(this.reporte);
    this._reporteService.Reportes(this.reporte).subscribe(
      response => {
        console.log("reporte!");
        console.log(response);
/*         this._reporteService.dowloadExcel(response); */
      }
    )
  }


}


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { ReporteService } from '../services/reporte.service';
import { ReporteDinamico } from '../models/reporte_dinamico';

@Component({
  selector: 'app-reportes-dinamicos',
  templateUrl: './reportes-dinamicos.component.html',
  styleUrls: ['./reportes-dinamicos.component.css'],
  providers: [ReporteService]
})
export class ReportesDinamicosComponent implements OnInit {

  estadosPago: any = [];
  conta06: any = [];
  usuarios: any = [];
  prioridades = [{ 'id': 'A', 'detalle': 'ALTA' }, { 'id': 'M', 'detalle': 'MEDIA' }, { 'id': 'B', 'detalle': 'BAJA' }];
  ReporteDinamico: ReporteDinamico;
  loading: boolean = false;

  constructor(
    private reportesService: ReporteService
  ) {
    this.getEstadosPago();
    this.getConta06();
    this.getUsuarios();
    this.ReporteDinamico = new ReporteDinamico('', '', '', '', '', '');
  }

  ngOnInit(): void {

  }


  registerReportes(form) {
    console.log('Formulario Reportes Dinamicos');
    console.log(this.ReporteDinamico);

    this.loading = true; // activa espere...

    this.reportesService.ReportesAll(this.ReporteDinamico).subscribe(
      response => {
        console.log('Respuesta del servidor');
        console.log(response);
        this.reportesService.dowloadExcel(response.data);
        this.loading = false; // quita espere...
      },
      error => {
        console.error(error);
        this.loading = false; // quita espere incluso en error
      }
    );
  }


  getEstadosPago() {
    this.reportesService.getEstadosPago({}).subscribe(
      response => {
        this.estadosPago = response.estados_pago;
      }
    )
  }

  getUsuarios() {
    this.reportesService.getUsuarios({}).subscribe(
      response => {
        this.usuarios = response.usuarios;
      })
  }

  getConta06() {
    this.reportesService.getConta06({}).subscribe(
      response => {
        this.conta06 = response.areas_pago;
      }
    )
  }
}

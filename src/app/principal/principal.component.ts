import { Component, OnInit, DoCheck } from '@angular/core';
import { Gener02Service } from '../services/gener02.service';
import { Teso13Service } from '../services/teso13.service';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [Gener02Service, Teso13Service]
})
export class PrincipalComponent implements OnInit {
  public identity;
  public token;
  public pagos:any = [];
  public pagosA:any = [];
  public pagosM:any = [];
  public pagosB:any = [];

  constructor( public _gener02Service: Gener02Service, public _teso13Service: Teso13Service) 
  {
    this.identity = this._gener02Service.getIdentity();
    this.token = this._gener02Service.getToken();
    this._teso13Service.getAllTeso13Pri(this.identity).subscribe(
      response => {
       this.pagos = response;
        console.log("pruebaaa");
        console.log(this.pagos);
       for (let index = 0; index < this.pagos.length; index++) {
  
        if(this.pagos[index].prioridad=='ALTA'){
          this.pagosA.push(this.pagos[index]);
        }
        if(this.pagos[index].prioridad=='MEDIA'){
          this.pagosM.push(this.pagos[index]);
        }
        if(this.pagos[index].prioridad=='BAJA'){
          this.pagosB.push(this.pagos[index]);
        }
       }
      }
    )
  }

  ngOnInit(): void {
    
  }
  ngDoCheck(): void{
    this.identity = this._gener02Service.getIdentity();
    this.token = this._gener02Service.getToken();

  }


  cambioEstadoNombre(estado: any) {
    var estadoEscr

    if (estado == 'RV') {
        estadoEscr = 'Revisión';
    }
    if (estado == 'RA') {
        estadoEscr = 'Radicado';
    }
    if (estado == 'AN') {
        estadoEscr = 'Anulado';
    }
    if (estado == 'AU') {
        estadoEscr = 'Autorizado';
    }
    if (estado == 'FI') {
        estadoEscr = 'Financiera';
    }
    if (estado == 'CT') {
        estadoEscr = 'Causación de Cuenta';
    }
    if (estado == 'PC') {
        estadoEscr = 'Causación Pago';
    }
    if (estado == 'DR') {
        estadoEscr = 'Devuelto Radicado';
    }
    if (estado == 'RT') {
        estadoEscr = 'Autorización Pago';
    }
    if (estado == 'DC') {
        estadoEscr = 'Devuelto Causación';
    }
    if (estado == 'PB') {
        estadoEscr = 'Pago Banco';
    }
    if (estado == 'PP') {
        estadoEscr = 'Pago Portal';
    }
    if (estado == 'RP') {
        estadoEscr = 'Preparación Transferencia';
    }
    if (estado == 'LC') {
        estadoEscr = 'Legalización de Cheque';
    }
    if (estado == 'CF') {
        estadoEscr = 'Cheque en Firmas';
    }
    if (estado == 'CE') {
        estadoEscr = 'Cheque Entregado';
    }
    if (estado == 'VF') {
        estadoEscr = 'Verificación Estado de Transferencia';
    }
    if (estado == 'PE') {
        estadoEscr = 'Pago Exitoso';
    }
    if (estado == 'CA') {
        estadoEscr = 'Causación de Pago';
    }

    return estadoEscr;
}

}

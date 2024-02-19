import { Component } from '@angular/core';
import { Teso13Service } from '../services/teso13.service';
import { Gener02Service } from '../services/gener02.service';
import { Editarteso13 } from '../models/editarteso13';
import { Teso13modalComponent } from '../modal/teso13modal/teso13modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';


@Component({
  selector: 'app-teso13editar',
  templateUrl: './teso13editar.component.html',
  styleUrls: ['./teso13editar.component.css'],
  providers: [Teso13Service, Gener02Service]
})
export class Teso13editarComponent {

  public editarteso13: Editarteso13;
  public identity: any;
  public data_teso13: any = [];

  constructor(private _teso13Service: Teso13Service, private _gener02Service: Gener02Service,  public dialog: MatDialog) {

    this.identity = this._gener02Service.getIdentity();
    this.editarteso13 = new Editarteso13('', '', '', '', '', '', '', '', '', '', '', '', '', this.identity.sub, this.identity.sub);
    this.editarteso13.usuario = this.identity.sub;

    this._teso13Service.getTeso13Editar(this.editarteso13).subscribe(
      response => {
        this.data_teso13 = response;
      }
    )
    
  }

  editar(dt: any) {
    
    const dialogRef = this.dialog.open(Teso13modalComponent);
    dialogRef.afterClosed().subscribe(
      res => {
        // Haz algo después de que se cierre el modal, si es necesario
      }
    );
      dialogRef.afterClosed().subscribe(
        res => {

        }
      )
    
  }

}

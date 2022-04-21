import { Component, OnInit } from '@angular/core';
//import { Gener02 } from '../models/gener02';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public page_title: string;
  //public user: Gener02;
  constructor() { 
    this.page_title='Pagina de Registro'
    //this.user = new Gener02('103','','','','','','','','','',3,'','');

  }

  ngOnInit(): void {
  }

}

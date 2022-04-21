import { Component, OnInit, DoCheck } from '@angular/core';
import { Gener02Service } from '../services/gener02.service';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [Gener02Service]
})
export class PrincipalComponent implements OnInit {
  public identity;
  public token;

  constructor( public _gener02Service: Gener02Service) 
  {
    this.identity = this._gener02Service.getIdentity();
    this.token = this._gener02Service.getToken();
  }

  ngOnInit(): void {
    
  }
  ngDoCheck(): void{
    this.identity = this._gener02Service.getIdentity();
    this.token = this._gener02Service.getToken();

  }

}

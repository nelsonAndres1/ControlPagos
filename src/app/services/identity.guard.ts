import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { Gener02Service } from "./gener02.service";

@Injectable()
export class IdentityGuard implements CanActivate{
    
    constructor(
        private _route: Router,
        private _gener02Service: Gener02Service
    ){

    }

    canActivate(){
        let identity = this._gener02Service.getIdentity();
        if(identity){
          
            return true;
        }else{
            this._route.navigate(['/login']);
            return false;
        }
    }
}
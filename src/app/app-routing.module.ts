//import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { Teso10Component } from './teso10/teso10.component';
import { PrincipalComponent } from './principal/principal.component';
import { Teso12Component } from './teso12/teso12.component';
import { Teso13Component } from './teso13/teso13.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { Teso15Component } from './teso15/teso15.component';
import { Teso16Component } from './teso16/teso16.component';
import { Teso17Component } from './teso17/teso17.component';
import { Teso117Component } from './teso117/teso117.component';
import { RegisterComponent } from './register/register.component';
import { Teso14Component } from './teso14/teso14.component';
import { Teso110Component } from './teso110/teso110.component';
import { Teso112Component } from './teso112/teso112.component';
import { Teso114Component } from './teso114/teso114.component';
import { Teso113Component } from './teso113/teso113.component';
import { Teso116Component } from './teso116/teso116.component';
import { Teso1116Component } from './teso1116/teso1116.component';
import { Teso1117Component } from './teso1117/teso1117.component';
import { Teso118Component } from './teso118/teso118.component';
const routes: Routes = [

  {path: '',pathMatch:'full',redirectTo:'login'},
  {path: 'principal', component:PrincipalComponent},
  {path: 'login', component:LoginComponent},
  {path: 'logout/:sure', component:LoginComponent},
  {path: 'teso10', component:Teso10Component},
  {path: 'teso12', component:Teso12Component},
  {path: 'teso13', component:Teso13Component},
  {path: 'teso14', component:Teso14Component},
  {path: 'teso114', component:Teso114Component},
  {path: 'teso15', component:Teso15Component},
  {path: 'teso16', component:Teso16Component},
  {path: 'teso17', component:Teso17Component},
  {path: 'teso117', component:Teso117Component},
  {path: 'teso110', component:Teso110Component},
  {path: 'teso112', component:Teso112Component},
  {path: 'teso113', component:Teso113Component},
  {path: 'register', component:RegisterComponent},
  {path: 'teso116', component:Teso116Component},
  {path: 'teso1116', component:Teso1116Component},
  {path: 'teso1117', component:Teso1117Component},
  {path: 'teso118',component:Teso118Component},
  {path: '**', component:ErrorComponent}

];
//Exportar configuración 
export const appRoutingProviders: any[]=[];
export const routing:ModuleWithProviders<any> = RouterModule.forRoot(routes);



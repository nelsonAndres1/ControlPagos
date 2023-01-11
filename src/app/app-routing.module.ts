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
import { Teso18Component } from './teso18/teso18.component';
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
import { Teso1118Component } from './teso1118/teso1118.component';
import { LoginGuard } from './services/login.guard';
import { IdentityGuard } from './services/identity.guard';
const routes: Routes = [

  {path: '',component:LoginComponent, canActivate:[LoginGuard] },
  {path: 'login', component:LoginComponent, canActivate:[LoginGuard] },
  {path: 'principal', component:PrincipalComponent, canActivate: [IdentityGuard] },
  {path: 'logout/:sure', component:LoginComponent, canActivate: [IdentityGuard] },
  {path: 'teso10', component:Teso10Component, canActivate: [IdentityGuard] },
  {path: 'teso12', component:Teso12Component, canActivate: [IdentityGuard] },
  {path: 'teso13', component:Teso13Component, canActivate: [IdentityGuard] },
  {path: 'teso14', component:Teso14Component, canActivate: [IdentityGuard] },
  {path: 'teso114', component:Teso114Component, canActivate: [IdentityGuard] },
  {path: 'teso15', component:Teso15Component, canActivate: [IdentityGuard] },
  {path: 'teso16', component:Teso16Component, canActivate: [IdentityGuard] },
  {path: 'teso17', component:Teso17Component, canActivate: [IdentityGuard] },
  {path: 'teso18', component:Teso18Component, canActivate: [IdentityGuard] },
  {path: 'teso117', component:Teso117Component, canActivate: [IdentityGuard] },
  {path: 'teso110', component:Teso110Component, canActivate: [IdentityGuard] },
  {path: 'teso112', component:Teso112Component, canActivate: [IdentityGuard] },
  {path: 'teso113', component:Teso113Component, canActivate: [IdentityGuard] },
  {path: 'register', component:RegisterComponent, canActivate: [IdentityGuard] },
  {path: 'teso116', component:Teso116Component, canActivate: [IdentityGuard] },
  {path: 'teso1116', component:Teso1116Component, canActivate: [IdentityGuard] },
  {path: 'teso1117', component:Teso1117Component, canActivate: [IdentityGuard] },
  {path: 'teso1118',component:Teso1118Component, canActivate: [IdentityGuard] },
  {path: 'teso118',component:Teso118Component, canActivate: [IdentityGuard] },
  {path: '**', component:ErrorComponent, canActivate: [IdentityGuard] }

];
//Exportar configuración 
export const appRoutingProviders: any[]=[];
export const routing:ModuleWithProviders<any> = RouterModule.forRoot(routes);



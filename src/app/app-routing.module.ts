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
import { EditarTeso12Component } from './editar-teso12/editar-teso12.component';
import { LoginGuard } from './services/login.guard';
import { IdentityGuard } from './services/identity.guard';
import { ReportesComponent } from './reportes/reportes.component';
import { CausadoresComponent } from './causadores/causadores.component';
import { Teso12UploadComponent } from './teso12-upload/teso12-upload.component';
import { Teso13editarComponent } from './teso13editar/teso13editar.component';
import { Teso13modalComponent } from './modal/teso13modal/teso13modal.component';
import { Teso13ReimprimirComponent } from './teso13-reimprimir/teso13-reimprimir.component';
import { RevisoresAutorizacionComponent } from './revisores-autorizacion/revisores-autorizacion.component';
import { Teso20Component } from './teso20/teso20.component';
import { Teso21Component } from './teso21/teso21.component';
import { Teso22Component } from './teso22/teso22.component';
import { Teso117SuperComponent } from './teso117-super/teso117-super.component';

const routes: Routes = [

  { path: '', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'principal', component: PrincipalComponent, canActivate: [IdentityGuard] },
  { path: 'logout/:sure', component: LoginComponent, canActivate: [IdentityGuard] },
  { path: 'teso10', component: Teso10Component, canActivate: [IdentityGuard] },
  { path: 'teso12', component: Teso12Component, canActivate: [IdentityGuard] },
  { path: 'teso12_upload', component: Teso12UploadComponent, canActivate: [IdentityGuard] },
  { path: 'editar_teso12', component: EditarTeso12Component, canActivate: [IdentityGuard] },
  { path: 'teso13', component: Teso13Component, canActivate: [IdentityGuard] },
  { path: 'editar_teso13', component: Teso13editarComponent, canActivate: [IdentityGuard] },
  { path: 'teso14', component: Teso14Component, canActivate: [IdentityGuard] },
  { path: 'teso114', component: Teso114Component, canActivate: [IdentityGuard] },
  { path: 'teso15', component: Teso15Component, canActivate: [IdentityGuard] },
  { path: 'teso16', component: Teso16Component, canActivate: [IdentityGuard] },
  { path: 'teso17', component: Teso17Component, canActivate: [IdentityGuard] },
  { path: 'teso18', component: Teso18Component, canActivate: [IdentityGuard] },
  { path: 'teso117', component: Teso117Component, canActivate: [IdentityGuard] },
  { path: 'teso110', component: Teso110Component, canActivate: [IdentityGuard] },
  { path: 'teso112', component: Teso112Component, canActivate: [IdentityGuard] },
  { path: 'teso113', component: Teso113Component, canActivate: [IdentityGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [IdentityGuard] },
  { path: 'teso116', component: Teso116Component, canActivate: [IdentityGuard] },
  { path: 'teso1116', component: Teso1116Component, canActivate: [IdentityGuard] },
  { path: 'teso1117', component: Teso1117Component, canActivate: [IdentityGuard] },
  { path: 'teso1118', component: Teso1118Component, canActivate: [IdentityGuard] },
  { path: 'teso118', component: Teso118Component, canActivate: [IdentityGuard] },
  { path: 'reporte', component: ReportesComponent, canActivate: [IdentityGuard] },
  { path: 'causadores', component: CausadoresComponent, canActivate: [IdentityGuard] },
  { path: 'teso13_modal', component: Teso13modalComponent, canActivate: [IdentityGuard] },
  { path: 'teso13_reimprimir', component: Teso13ReimprimirComponent, canActivate: [IdentityGuard] },
  { path: 'revisa_autoriza', component: RevisoresAutorizacionComponent, canActivate: [IdentityGuard] },
  { path: 'teso20', component: Teso20Component, canActivate: [IdentityGuard] },
  { path: 'teso21', component: Teso21Component, canActivate: [IdentityGuard] },
  { path: 'teso22', component: Teso22Component, canActivate: [IdentityGuard] },
  { path: 'teso117/super', component: Teso117SuperComponent, canActivate: [IdentityGuard] },
  { path: '**', component: ErrorComponent, canActivate: [IdentityGuard] }

];
//Exportar configuración 
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes);



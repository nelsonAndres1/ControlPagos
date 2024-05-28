import { NgModule } from '@angular/core';
import { routing } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Teso10Component } from './teso10/teso10.component';
import { PrincipalComponent } from './principal/principal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { BarcodeGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { Teso12Component } from './teso12/teso12.component';
import { Teso13Component } from './teso13/teso13.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { RegisterComponent } from './register/register.component';
import { Teso15Component } from './teso15/teso15.component';
import { Teso16Component } from './teso16/teso16.component';
import { Teso17Component } from './teso17/teso17.component';
import { Teso117Component } from './teso117/teso117.component';
import { Teso14Component } from './teso14/teso14.component';
import { Teso110Component } from './teso110/teso110.component';
import { Teso112Component } from './teso112/teso112.component';
import { Teso114Component } from './teso114/teso114.component';

import { Teso113Component } from './teso113/teso113.component';
import { Teso116Component } from './teso116/teso116.component';
import { Teso1116Component } from './teso1116/teso1116.component';
import { Teso1117Component } from './teso1117/teso1117.component';
import { Teso118Component } from './teso118/teso118.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { Teso18Component } from './teso18/teso18.component';
import { Teso1118Component } from './teso1118/teso1118.component';
import { IdentityGuard } from './services/identity.guard';
import { LoginGuard } from './services/login.guard';
import { Gener02Service } from './services/gener02.service';
import { EditarTeso12Component } from './editar-teso12/editar-teso12.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SidebarModule } from 'ng-cdbangular';
import { IconModule } from 'ng-cdbangular';
import { BadgeModule } from 'ng-cdbangular';
import { CausadoresComponent } from './causadores/causadores.component';
import { Teso12UploadComponent } from './teso12-upload/teso12-upload.component';
import { Teso13editarComponent } from './teso13editar/teso13editar.component';
import { Teso13modalComponent } from './modal/teso13modal/teso13modal.component';

import { MatDialogModule } from '@angular/material/dialog';
import { Teso13ReimprimirComponent } from './teso13-reimprimir/teso13-reimprimir.component';
import { UtilidadesComponent } from './utilidades/utilidades.component';
import { RevisoresAutorizacionComponent } from './revisores-autorizacion/revisores-autorizacion.component';
import { Modal1Component } from './modal/modal1/modal1.component';
import { Teso20Component } from './teso20/teso20.component';
import { Teso21Component } from './teso21/teso21.component';
import { Teso21hijoComponent } from './teso21hijo/teso21hijo.component';
import { DynamicSelectComponent } from './dynamic-select/dynamic-select.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    Teso10Component,
    PrincipalComponent,
    Teso12Component,
    Teso13Component,
    LoginComponent,
    ErrorComponent,
    RegisterComponent,
    Teso15Component,
    Teso16Component,
    Teso17Component,
    Teso117Component,
    Teso14Component,
    Teso110Component,
    Teso112Component,
    Teso114Component,
    Teso113Component,
    Teso116Component,
    Teso1116Component,
    Teso1117Component,
    Teso118Component,
    Teso18Component,
    Teso1118Component,
    EditarTeso12Component,
    ReportesComponent,
    CausadoresComponent,
    Teso12UploadComponent,
    Teso13editarComponent,
    Teso13modalComponent,
    Teso13ReimprimirComponent,
    UtilidadesComponent,
    RevisoresAutorizacionComponent,
    Modal1Component,
    Teso20Component,
    Teso21Component,
    Teso21hijoComponent,
    DynamicSelectComponent
  ],

  imports: [
    NgxGraphModule,
    BrowserAnimationsModule,
    BadgeModule,
    IconModule,
    SidebarModule,
    BrowserModule,
    BarcodeGeneratorAllModule,
    BarcodeScannerLivestreamModule,
    AngularFileUploaderModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SweetAlert2Module,
    NgxBarcodeModule,
    ScrollingModule,
    SweetAlert2Module.forRoot(),
    routing,
    PdfViewerModule,
    MatDialogModule

  ],
  providers: [
    IdentityGuard,
    LoginGuard,
    Gener02Service,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

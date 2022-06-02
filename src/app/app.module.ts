import { NgModule } from '@angular/core';
import { routing,appRoutingProviders } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Teso10Component } from './teso10/teso10.component';
import { PrincipalComponent } from './principal/principal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { BarcodeGeneratorAllModule,QRCodeGeneratorAllModule,DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

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
import {MatCardModule} from '@angular/material/card';
import { Teso113Component } from './teso113/teso113.component';
import { Teso116Component } from './teso116/teso116.component';
import { Teso1116Component } from './teso1116/teso1116.component';
import { Teso1117Component } from './teso1117/teso1117.component';
import { Teso118Component } from './teso118/teso118.component';
import { NgxBarcodeModule } from 'ngx-barcode';


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
    Teso118Component
  ],
  
  imports: [
    BrowserModule,
    BarcodeGeneratorAllModule,
    BarcodeScannerLivestreamModule,
    AngularFileUploaderModule,
    //AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SweetAlert2Module,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    NgxBarcodeModule,
    MatCardModule,    
    
    SweetAlert2Module.forRoot(),
    routing
  ],
   //appRoutingProviders sin llaves y con corchetes
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

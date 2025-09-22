import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Gener02 } from "../models/gener02";
import { global } from "./global";
import * as fs from 'file-saver';
import { LOGO } from "./logo";
import { ImagePosition, Workbook } from "exceljs";

@Injectable()
export class ReporteService {
    public url: string;
    public identity: any;
    public token: any;
    private _worbook!: Workbook;
    constructor(public _http: HttpClient) {
        this.url = global.url;
    }
    Reportes(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'reportes/Reportes', params, { headers: headers });
    }

    ReportesAll(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'reportes/ReportesAll', params, { headers: headers });
    }
    getEstadosPago(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'reportes/getEstadosPago', params, { headers: headers });
    }
    getConta06(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'reportes/getConta06', params, { headers: headers });
    }

    getUsuarios(user: any): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'reportes/getUsuarios', params, { headers: headers });
    }

    async dowloadExcel(dataExcel): Promise<void> {
        this._worbook = new Workbook();
        this._worbook.creator = 'Sistema de Ingreso - F5';
        await this._createHeroTable(dataExcel);

        this._worbook.xlsx.writeBuffer().then((data) => {
            const blod = new Blob([data]);
            fs.saveAs(blod, 'Reporte_Control_Pagos.xlsx');
        })
    }


    private _createHeroTable(dataExcel): void {
        console.log("dataaa!!!!");
        var campos = Object.keys(dataExcel[0]);
        console.log(campos);
        const sheet = this._worbook.addWorksheet('hoja 1');
        sheet.getColumn("A").width = 21;
        sheet.getColumn("B").width = 35;
        sheet.getColumn("C").width = 21;
        sheet.getColumn("D").width = 21;
        sheet.getColumn("E").width = 21;
        sheet.getColumn("F").width = 21;
        sheet.getColumn("G").width = 21;
        sheet.getColumn("H").width = 21;
        sheet.getColumn("I").width = 21;
        sheet.columns.forEach((column) => {
            column.alignment = { vertical: 'middle', wrapText: true };
        });

        const logo = this._worbook.addImage({
            base64: LOGO,
            extension: 'png'
        });

        const position: ImagePosition = {
            tl: { col: 0.15, row: 1.3 },
            ext: { width: 128, height: 128 }
        }

        sheet.addImage(logo, position);
        const titleCell = sheet.getCell('C5');
        titleCell.value = 'REPORTE PAGOS';
        titleCell.style.font = { bold: true, size: 13 }
        const headerRow = sheet.getRow(10);
        headerRow.values = campos;
        headerRow.font = { bold: true, size: 13 };
        const rowsToInsert = sheet.getRows(11, dataExcel.length)!;
        let values: any = [];
        for (let index = 0; index < rowsToInsert.length; index++) {
            const itemData = dataExcel[index];
            const row = rowsToInsert[index];
            for (let index = 0; index < campos.length; index++) {
                values.push(itemData[campos[index]]);
            }
            row.values = values;
            values = [];
            console.log("values");
            console.log(row.values)
            console.log(row)
        }
    }


    signup(user: any, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = 'true';
        }
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'login', params, { headers: headers });
    }
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity') + '');

        if (identity && identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;

    }
    getToken() {
        let token = localStorage.getItem('token');
        if (token && token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
}
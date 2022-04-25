import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Router, ActivatedRoute} from '@angular/router';
import {Teso113} from '../models/teso113';
import {Teso15Service} from '../services/teso15.service';
import {Gener02} from '../models/gener02';
import Swal from 'sweetalert2';
@Component({selector: 'app-teso113', templateUrl: './teso113.component.html', styleUrls: ['./teso113.component.css'], providers: [Teso15Service]})
export class Teso113Component implements OnInit {

    @ViewChild('myData')myData : ElementRef;

    itemDetail : any = [];
    numero : any;
    codclas : any;
    public data : any;
    public identity : any;
    public identity1 : any;

    constructor(private route : ActivatedRoute, private _router: Router, private _teso15Service : Teso15Service) {
        this.route.queryParams.subscribe(response => {
            const paramsData = JSON.parse(response['result']);
            this.itemDetail = paramsData;
            this.numero = this.itemDetail[0];
            this.codclas = this.itemDetail[1];
            this._teso15Service.getAllTeso13(new Teso113(this.codclas, this.numero)).subscribe(response => {
                this.data = response;

                this.data['usuela'];

                this._teso15Service.getUsuario(new Gener02(this.data['usuela'], '')).subscribe(response => {
                    this.identity = response;
                    this.identity1 = this.identity[0]['nombre'];
                    
                    let timerInterval
                    Swal.fire({
                        title: 'Generando PDF...',
                        html: 'El proceso terminara en <b></b> milisegundos.',
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                                b.textContent = Swal.getTimerLeft()+ ''
                            }, 100)
                        },
                        willClose: () => {
                            this.setPdf();
                            console.log('Listo');
                            
                            clearInterval(timerInterval)
                        }
                    }).then((result) => { /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                            console.log('I was closed by the timer')
                        }
                    })

                })

            });


        });
    }


    setPdf() {
        setTimeout(() => {
            const data = this.myData.nativeElement;
            const doc = new jsPDF('p', 'pt', 'a4');
            html2canvas(data).then(canvas => {
                const imgWidth = 600;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const contentDataURL = canvas.toDataURL('image/png');
                doc.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
                doc.save('reporte_pago.pdf');
                doc.output('dataurlnewwindow');
            })
        }, 500);
        this._router.navigate['/principal'];
    }

    ngOnInit(): void {}

}

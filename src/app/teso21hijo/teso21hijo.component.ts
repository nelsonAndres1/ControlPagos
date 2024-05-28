import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-teso21hijo',
  templateUrl: './teso21hijo.component.html',
  styleUrls: ['./teso21hijo.component.css']
})
export class Teso21hijoComponent {

  @Input() arbolProcesos: any[];
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-select',
  template: `
    <li>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="dynamicSelect{{selectData.id}}">Opciones {{selectData.id + 1}}</label>
        </div>
        <select class="custom-select" [(ngModel)]="selectData.selectedValue" (change)="onValueChange()" [id]="'dynamicSelect' + selectData.id">
          <option selected>Seleccione...</option>
          <option *ngFor="let option of options" [value]="option.id">{{option.proceso}}</option>
        </select>
        <div class="input-group-append">
          <input type="number" class="form-control" [(ngModel)]="selectData.numSubSelects" [min]="0" [placeholder]="'Subselects'">
          <button class="btn btn-primary" type="button" (click)="addSubSelects()">Agregar SubSelects</button>
          <button class="btn btn-danger" type="button" (click)="removeSelf()">Eliminar</button>
        </div>
      </div>
      <ul *ngIf="selectData.subSelects && selectData.subSelects.length">
        <app-dynamic-select *ngFor="let subSelect of selectData.subSelects; let j = index" 
                            [selectData]="subSelect" 
                            [options]="options"
                            (addSubSelect)="handleAddSubSelect($event, subSelect)"
                            (removeSelect)="handleRemoveSubSelect(subSelect, j)">
        </app-dynamic-select>
      </ul>
    </li>
  `,
  styles: [`
    ul.tree, ul.tree ul {
      list-style-type: none;
      position: relative;
    }
    ul.tree ul {
      margin-left: 20px;
    }
    ul.tree:before, ul.tree ul:before {
      content: '';
      display: block;
      width: 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: -10px;
      border-left: 1px solid #ccc;
    }
    ul.tree li {
      margin: 0;
      padding: 0 7px;
      line-height: 20px;
      color: #369;
      font-weight: 700;
      position: relative;
    }
    ul.tree li:before {
      content: '';
      display: block;
      width: 10px;
      height: 0;
      border-top: 1px solid #ccc;
      margin-top: -1px;
      position: absolute;
      top: 10px;
      left: 0;
    }
    ul.tree li:last-child:before {
      background: white;
      height: auto;
      top: 10px;
      bottom: 0;
    }
  `]
})
export class DynamicSelectComponent {
  @Input() selectData: any;
  @Input() options: any[];
  @Output() addSubSelect = new EventEmitter<any>();
  @Output() removeSelect = new EventEmitter<any>();

  addSubSelects() {
    this.addSubSelect.emit(this.selectData);
  }

  removeSelf() {
    this.removeSelect.emit();
  }

  onValueChange() {
    this.selectData.subSelects = [];
  }

  handleAddSubSelect(event: any, subSelect: any) {
    if (subSelect.numSubSelects > 0) {
      const subSelectsToAdd = Array.from({ length: subSelect.numSubSelects }, (_, index) => ({
        id: subSelect.subSelects.length + index,
        parentId: subSelect.selectedValue,
        options: this.options.filter(option => option.parentId === subSelect.selectedValue),
        selectedValue: null,
        numSubSelects: 0,
        subSelects: []
      }));
      subSelect.subSelects.push(...subSelectsToAdd);
    }
  }

  handleRemoveSubSelect(subSelect: any, index: number) {
    subSelect.subSelects.splice(index, 1);
  }
}

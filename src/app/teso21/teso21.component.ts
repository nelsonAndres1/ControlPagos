import { Component } from '@angular/core';
import { Teso20Service } from '../services/teso20.service';
import { Teso21Service } from '../services/teso21.service';
import { Gener02Service } from '../services/gener02.service';
import * as shape from 'd3-shape';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly';
import { Layout } from '@swimlane/ngx-graph';
import { Teso21 } from '../models/teso21';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-teso21',
  templateUrl: './teso21.component.html',
  styleUrls: ['./teso21.component.css'],
  providers: [Gener02Service, Teso20Service, Teso21Service]
})
export class Teso21Component {

  data_teso20: any = [];
  dynamicSelects: any[] = [];
  numSelects: number = 0;
  selectedHeaderId: number | null = null;
  node_temporal = '';
  enlace1_id: any;
  enlace2_id: any;
  enlace_detalle: any;
  links_ = [];
  nodes_ = [];
  clusters_ = [];
  clusters_fin: any;
  node_temporal_id: any;
  nombre_proceso: any;
  curve: any = shape.curveLinear;
  layout: Layout = new DagreNodesOnlyLayout();
  layoutSettings = {
    orientation: 'TB'
  };
  observacion_: any = 'NO';
  archivo_: any = 'NO';
  teso21_: Teso21;
  identity: any;

  constructor(private _Gener02Service: Gener02Service, private _Teso20Service: Teso20Service, private _Teso21Service: Teso21Service) {
    this.allTeso20();
    this.identity = this._Gener02Service.getIdentity();
    this.teso21_ = new Teso21('', '', []);
    this.teso21_.usuario = this.identity.sub;

  }

  allTeso20() {
    this._Teso20Service.getAll({}).subscribe(
      response => {
        this.data_teso20 = response;
        console.log(this.data_teso20);
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }

  ingrese(event) {
    this.node_temporal_id = event.target.value;
    for (let index = 0; index < this.data_teso20.length; index++) {
      if (this.node_temporal_id == this.data_teso20[index].id) {
        this.node_temporal = this.data_teso20[index].proceso;
      }
    }
  }

  enviar() {
    const newCluster = {
      id: this.node_temporal_id,
      label: this.node_temporal
    };
    this.nodes_.push(newCluster);
    this.nodes_ = Object.values(this.nodes_);
  }

  eliminar_nodo(nodo) {
    for (let index = 0; index < this.nodes_.length; index++) {
      if (this.nodes_[index].id == nodo.id) {
        this.nodes_.splice(index, 1);
      }
    }

    if (this.links_.length > 0) {
      for (let index = 0; index < this.links_.length; index++) {
        if (this.links_[index].source == nodo.id || this.links_[index].target == nodo.id) {
          this.links_.splice(index, 1);
        }
      }
      this.links_ = Object.values(this.links_);
    }


    this.nodes_ = Object.values(this.nodes_);
    console.log(this.nodes_);
  }

  enviar_enlaces() {
    const newEnlace = {
      id: 'link-' + this.enlace1_id + '-' + this.enlace2_id,
      source: this.enlace1_id,
      target: this.enlace2_id,
      label: this.enlace_detalle,
      archivo: this.archivo_,
      observacion: this.observacion_
    };

    this.links_.push(newEnlace);
    this.links_ = Object.values(this.links_);


    console.log("enlaces!");
    console.log(this.links_)
  }

  enlace1(event) {
    this.enlace1_id = event.target.value;
  }

  enlace2(event) {
    this.enlace2_id = event.target.value;
  }

  input_obs(event) {
    this.enlace_detalle = event.target.value;
  }

  addProceso(event) {
    this.nombre_proceso = event.target.value;
    this.teso21_.nombre_proceso = this.nombre_proceso;
  }

  guardar() {
    console.log("información enlaces!");
    console.log(this.links_)

    this.teso21_.array = this.links_;


    this._Teso21Service.save(this.teso21_).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire("Cambios guardados!", "", "success");
        } else {
          Swal.fire("Cambios No guardados!", "", "error");
        }
      }
    )


    console.log("información nodes!");
    console.log(this.teso21_)
  }


  observacion(event) {
    this.observacion_ = event.target.value;
  }

  archivo(event) {
    this.archivo_ = event.target.value;
  }
  

}

import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Teso20Service } from '../services/teso20.service';
import { Teso21Service } from '../services/teso21.service';
import { Gener02Service } from '../services/gener02.service';
import * as shape from 'd3-shape';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly';
import { Layout } from '@swimlane/ngx-graph';
import { Teso21 } from '../models/teso21';
import Swal from 'sweetalert2';
import { Teso22Service } from '../services/teso22.service';
import { Teso21get } from '../models/teso21get';

// Cytoscape
import cytoscape, { Core, ElementDefinition, EdgeSingular, NodeSingular } from 'cytoscape';
import dagre from 'cytoscape-dagre';
import edgehandles from 'cytoscape-edgehandles';

const contextMenus = require('cytoscape-context-menus');
// Si necesitas estilos del menú contextual, agrégalos en styles.css global:
// @import "~cytoscape-context-menus/cytoscape-context-menus.css";

cytoscape.use(dagre);
cytoscape.use(edgehandles);
cytoscape.use(contextMenus);

@Component({
  selector: 'app-teso21',
  templateUrl: './teso21.component.html',
  styleUrls: ['./teso21.component.css'],
  providers: [Gener02Service, Teso20Service, Teso21Service, Teso22Service]
})
export class Teso21Component implements AfterViewInit, OnDestroy {

  /* ===== Estado / lógica base ===== */
  data_teso20: any[] = [];
  arboles_existentes: any[] = [];
  editingId: string | null = null;        // nombre del proceso en edición (si aplica)

  // Form
  node_temporal = '';
  node_temporal_id: any;

  enlace1_id: any;
  enlace2_id: any;
  enlace_detalle: any;

  links_: any[] = [];
  nodes_: any[] = [];
  clusters_: any[] = [];
  clusters_fin: any;

  nombre_proceso: string = '';

  // NGX Graph (compatibilidad)
  curve: any = shape.curveMonotoneY;
  layout: Layout = new DagreNodesOnlyLayout();
  layoutSettings = { orientation: 'TB' };

  observacion_: 'SI' | 'NO' = 'NO';
  archivo_: 'SI' | 'NO' = 'NO';
  teso21_: Teso21;
  teso21get_: Teso21get;
  identity: any;

  /* ===== Vista Cytoscape ===== */
  @ViewChild('cyContainer', { static: false }) cyContainer!: ElementRef<HTMLDivElement>;
  useCytoscape = true;
  private cy?: Core;
  private eh?: any; // edgehandles instance

  DAGRE_OPTS: any = {
    name: 'dagre',
    rankDir: 'TB',   // 'TB' | 'BT' | 'LR' | 'RL'
    nodeSep: 40,
    edgeSep: 20,
    rankSep: 80,
    animate: false
  };

  constructor(
    private _Gener02Service: Gener02Service,
    private _Teso20Service: Teso20Service,
    private _Teso21Service: Teso21Service,
    private _Teso22Service: Teso22Service
  ) {
    this.identity = this._Gener02Service.getIdentity();

    this.teso21_ = new Teso21('', '', []);
    this.teso21_.usuario = this.identity?.sub;

    this.teso21get_ = new Teso21get('');

    this.allTeso20();
    this.getArbolesExistentes();
  }

  /* =====================
   *   CARGA DE CATÁLOGOS
   * ===================== */
  allTeso20() {
    this._Teso20Service.getAll({}).subscribe(
      (response: any[]) => { this.data_teso20 = response || []; },
      error => { console.error('Error fetching data', error); }
    );
  }

  getArbolesExistentes() {
    this._Teso22Service.getDistinctTeso21({}).subscribe(
      (response: any[]) => { this.arboles_existentes = response || []; },
      _ => { }
    );
  }

  /* ==============================
   *   UI: selección para edición
   * ============================== */
  select_iniciar_edicion(event: any) {
    this.editingId = event?.target?.value || null;
  }

  iniciar_edicion() {
    if (!this.editingId) return;

    this.teso21get_.proceso = this.editingId;
    this._Teso21Service.getFirstteso21(this.teso21get_).subscribe(
      (response: any[]) => {
        // 1) Mapear filas → grafo
        this.mapResponseToGraph(response || []);

        // 2) Autollenar nombre del proceso
        const nombre = (response?.[0]?.proceso || '').trim();
        this.nombre_proceso = nombre;
        this.teso21_.nombre_proceso = nombre;

        // 3) Refrescar vista
        if (this.useCytoscape) this.refreshCy();
      },
      error => console.error('Error cargando árbol:', error)
    );
  }

  /* ===============================
   *   MAPEO: filas → nodes_/links_
   * =============================== */
  private mapResponseToGraph(rows: any[]) {
    // LINKS
    const links = rows.map(r => ({
      id: `db-${r.id}`,
      source: String(r.id_teso20_padre),
      target: String(r.id_teso20_hijo),
      label: '', // podrías usar r.usuario_detalle o r.proceso si deseas
      archivo: r.archivo,
      observacion: r.observacion
    }));

    // NODES (padres e hijos únicos con label de *_detalle)
    const nodeMap: Record<string, string> = {};
    rows.forEach(r => {
      nodeMap[String(r.id_teso20_padre)] = (r.id_teso20_padre_detalle || '').trim();
      nodeMap[String(r.id_teso20_hijo)] = (r.id_teso20_hijo_detalle || '').trim();
    });

    const nodes = Object.keys(nodeMap).map(id => ({
      id,
      label: nodeMap[id] || `Nodo ${id}`
    }));

    this.links_ = links;
    this.nodes_ = nodes;
  }

  /* =====================
   *   NGX Graph actions
   * ===================== */
  ingrese(event: any) {
    this.node_temporal_id = event.target.value;
    for (let i = 0; i < this.data_teso20.length; i++) {
      if (String(this.node_temporal_id) === String(this.data_teso20[i].id)) {
        this.node_temporal = (this.data_teso20[i].proceso || '').trim();
        break;
      }
    }
  }

  enviar() {
    const idStr = String(this.node_temporal_id || '');
    if (!idStr || !this.node_temporal) return;

    // evitar duplicados
    if (this.nodes_.some(n => String(n.id) === idStr)) return;

    const newNode = { id: idStr, label: this.node_temporal };
    this.nodes_ = [...this.nodes_, newNode];

    if (this.useCytoscape) this.refreshCy();
  }

  eliminar_nodo(nodo: any) {
    const id = String(nodo?.id || '');
    if (!id) return;

    this.nodes_ = this.nodes_.filter(n => String(n.id) !== id);
    this.links_ = this.links_.filter(l => String(l.source) !== id && String(l.target) !== id);

    if (this.useCytoscape) this.refreshCy();
  }

  enlace1(event: any) { this.enlace1_id = event?.target?.value; }
  enlace2(event: any) { this.enlace2_id = event?.target?.value; }
  input_obs(event: any) { this.enlace_detalle = event?.target?.value; }

  enviar_enlaces() {
    const s = String(this.enlace1_id || '');
    const t = String(this.enlace2_id || '');
    if (!s || !t || s === t) return;

    // evitar duplicados exactos
    const exists = this.links_.some(l =>
      String(l.source) === s &&
      String(l.target) === t &&
      l.archivo === this.archivo_ &&
      l.observacion === this.observacion_ &&
      (l.label || '') === (this.enlace_detalle || '')
    );
    if (exists) return;

    const id = `link-${s}-${t}-${Date.now()}`;
    const newEnlace = {
      id,
      source: s,
      target: t,
      label: this.enlace_detalle || '',
      archivo: this.archivo_,
      observacion: this.observacion_
    };

    this.links_ = [...this.links_, newEnlace];

    if (this.useCytoscape) this.refreshCy();
  }

  addProceso(event: any) {
    this.nombre_proceso = (event?.target?.value || '').trim();
    this.teso21_.nombre_proceso = this.nombre_proceso;
  }

  /* ======================
   *   Guardar (crear solo)
   * ====================== */
  guardar() {
    // Arma el payload
    this.teso21_.array = this.links_;
    this.teso21_.nombre_proceso = (this.nombre_proceso || '').trim();
    this.teso21_.usuario = this.identity?.sub;

    if (!this.teso21_.nombre_proceso) {
      Swal.fire('Falta el Nombre Proceso', '', 'warning');
      return;
    }
    if (!this.teso21_.array || this.teso21_.array.length === 0) {
      Swal.fire('No hay enlaces para guardar', '', 'warning');
      return;
    }

    // 1) Intentar crear
    this._Teso21Service.save(this.teso21_).subscribe(
      (response: any) => {
        // Tu backend devuelve:
        // - {status:'success', code:200} => creado OK
        // - {status:'success', code:300} => ya existe
        if (response?.status === 'success' && response?.code === 200) {
          // Queda en modo edición de este nombre
          this.editingId = this.teso21_.nombre_proceso;
          Swal.fire('Proceso creado', '', 'success');
          return;
        }

        if (response?.status === 'success' && response?.code === 300) {
          // 2) Ya existe => preguntar si sobrescribe
          Swal.fire({
            icon: 'warning',
            title: 'El proceso ya existe',
            text: '¿Deseas sobrescribirlo con el árbol actual?',
            showCancelButton: true,
            confirmButtonText: 'Sobrescribir',
            cancelButtonText: 'Cancelar'
          }).then(res => {
            if (!res.isConfirmed) return;

            // 3) Reemplazar (delete + insert)
            this._Teso21Service.replace(this.teso21_).subscribe(
              (r2: any) => {
                if (r2?.status === 'success') {
                  this.editingId = this.teso21_.nombre_proceso;
                  Swal.fire('Árbol sobrescrito', '', 'success');
                } else {
                  Swal.fire('No se pudo sobrescribir', r2?.message || '', 'error');
                }
              },
              _ => Swal.fire('Error', 'No se pudo sobrescribir', 'error')
            );
          });
          return;
        }

        // Otro estado inesperado
        Swal.fire('Cambios No guardados', response?.message || '', 'error');
      },
      _ => Swal.fire('Error', 'No se pudo guardar', 'error')
    );
  }


  observacion(event: any) { this.observacion_ = (event?.target?.value || 'NO') as ('SI' | 'NO'); }
  archivo(event: any) { this.archivo_ = (event?.target?.value || 'NO') as ('SI' | 'NO'); }

  /* ====== Vista Cytoscape ====== */
  ngAfterViewInit(): void {
    if (this.useCytoscape) this.initCy();
  }

  ngOnDestroy(): void {
    this.destroyCy();
  }

  switchView(useCy: boolean): void {
    this.useCytoscape = useCy;
    if (useCy) {
      setTimeout(() => this.initCy(), 0);
    } else {
      this.destroyCy();
    }
  }

  private initCy(): void {
    if (!this.cyContainer) return;

    this.cy = cytoscape({
      container: this.cyContainer.nativeElement,
      elements: this.toCyElements(),
      layout: this.DAGRE_OPTS,
      wheelSensitivity: 0.2,
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'round-rectangle',
            'background-color': (ele: NodeSingular) => ele.data('color') || '#e2e8f0',
            'label': 'data(label)',
            'text-valign': 'top',
            'text-halign': 'left',
            'font-size': 12,
            'color': '#0f172a',
            'text-margin-x': 8,
            'text-margin-y': -6,
            'width': 220,
            'height': 88,
            'border-width': 1,
            'border-color': '#94a3b8',
            'padding': '6'
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'line-color': (ele: EdgeSingular) => this.edgeColor(ele),
            'width': (ele: EdgeSingular) => ele.data('archivo') === 'SI' ? 4 : 2.5,
            'target-arrow-shape': 'triangle',
            'target-arrow-color': (ele: EdgeSingular) => this.edgeColor(ele),
            'arrow-scale': 1.2,
            'line-style': (ele: EdgeSingular) => ele.data('observacion') === 'SI' ? 'dashed' : 'solid',
            'opacity': 0.95
          }
        },
        { selector: '.highlighted', style: { 'line-color': '#2563eb', 'target-arrow-color': '#2563eb', 'opacity': 1, 'width': 4 } },
        { selector: '.dimmed', style: { 'opacity': 0.25 } },
        { selector: 'node:selected', style: { 'border-width': 3, 'border-color': '#ef4444' } },
        { selector: 'edge:selected', style: { 'line-color': '#ef4444', 'target-arrow-color': '#ef4444', 'width': 4 } },
      ]
    });

    this.eh = (cytoscape as any).edgehandles(this.cy, {
      snap: true,
      noEdgeEventsInDraw: true,
      disableBrowserGestures: true,
      edgeParams: () => ({ data: { observacion: this.observacion_, archivo: this.archivo_ } })
    });

    // Completar arista arrastrando: reusar tu lógica enviar_enlaces()
    this.cy.on('ehcomplete', (_event, source, target, addedEdge) => {
      this.enlace1_id = source.id();
      this.enlace2_id = target.id();
      this.enlace_detalle = this.enlace_detalle || '';
      this.enviar_enlaces();
      if (addedEdge) { addedEdge.remove(); }
      this.refreshCy();
    });

    // Menú contextual (si agregaste el CSS global)
    (this.cy as any).contextMenus({
      menuItems: [
        {
          id: 'delete-node',
          content: '🗑 Eliminar',
          tooltipText: 'Eliminar nodo',
          selector: 'node',
          onClickFunction: (event: any) => {
            const node = event.target;
            this.eliminar_nodo({ id: node.id() });
            node.remove();
            this.cy?.layout(this.DAGRE_OPTS).run();
            this.cy?.fit(undefined, 20);
          },
          hasTrailingDivider: true
        },
        {
          id: 'delete-edge',
          content: '🗑 Eliminar enlace',
          tooltipText: 'Eliminar enlace',
          selector: 'edge',
          onClickFunction: (event: any) => {
            const edge = event.target;
            this.links_ = this.links_.filter(l => String(l.id) !== String(edge.id()));
            edge.remove();
            this.cy?.layout(this.DAGRE_OPTS).run();
            this.cy?.fit(undefined, 20);
          }
        }
      ]
    });

    // Highlight/atenuación
    this.cy.on('mouseover', 'edge', (evt) => this.highlightEdge(evt.target));
    this.cy.on('mouseout', 'edge', () => this.clearHighlight());
    this.cy.on('tap', 'node', (evt) => this.highlightNeighborhood(evt.target));

    setTimeout(() => this.cy && this.cy.fit(undefined, 20), 0);
  }

  private destroyCy(): void {
    try { if (this.eh) this.eh.destroy(); } catch { }
    try { if (this.cy) this.cy.destroy(); } catch { }
    this.cy = undefined;
    this.eh = undefined;
  }

  private toCyElements(): ElementDefinition[] {
    const nodes: ElementDefinition[] = (this.nodes_ || []).map((n: any) => ({
      data: { id: String(n.id), label: n.label, color: n.data?.color }
    }));
    const edges: ElementDefinition[] = (this.links_ || []).map((l: any, i: number) => ({
      data: {
        id: l.id || `e${i}`,
        source: String(l.source),
        target: String(l.target),
        observacion: l.observacion,
        archivo: l.archivo,
        label: l.label || ''
      }
    }));
    return [...nodes, ...edges];
  }

  private edgeColor(ele: EdgeSingular): string {
    const s = ele.source();
    return (s && s.data('color')) ? s.data('color') : '#64748b';
  }

  private refreshCy(): void {
    if (!this.cy) return;
    const eles = this.toCyElements();
    this.cy.elements().remove();
    this.cy.add(eles);
    this.cy.layout(this.DAGRE_OPTS).run();
    this.cy.fit(undefined, 20);
  }

  // UX highlight
  private highlightEdge(edge: EdgeSingular): void {
    if (!this.cy) return;
    this.clearHighlight();
    edge.addClass('highlighted');
    edge.source().addClass('highlighted');
    edge.target().addClass('highlighted');
    this.cy.elements().difference(edge.closedNeighborhood()).addClass('dimmed');
  }

  private highlightNeighborhood(node: NodeSingular): void {
    if (!this.cy) return;
    this.clearHighlight();
    const nh = node.closedNeighborhood();
    nh.addClass('highlighted');
    this.cy.elements().difference(nh).addClass('dimmed');
  }

  private clearHighlight(): void {
    if (!this.cy) return;
    this.cy.elements().removeClass('highlighted dimmed');
  }

  // Util para NGX (gradiente de arista)
  getNodeColor(nodeId: string): string {
    const n = (this.nodes_ || []).find((x: any) => String(x.id) === String(nodeId));
    return n?.data?.color || '#64748b';
  }

  /* ==========================
   *   Acciones de eliminación
   * ========================== */
  deleteSelected() {
    if (!this.cy) return;

    const selected = this.cy.$(':selected');

    // 1) Aristas
    selected.edges().forEach(e => {
      const id = String(e.id());
      this.links_ = this.links_.filter(l => String(l.id) !== id);
      e.remove();
    });

    // 2) Nodos
    selected.nodes().forEach(n => {
      const id = String(n.id());
      this.nodes_ = this.nodes_.filter(nd => String(nd.id) !== id);
      this.links_ = this.links_.filter(l => String(l.source) !== id && String(l.target) !== id);
      n.remove();
    });

    // Normaliza y recalcula
    this.nodes_ = Object.values(this.nodes_);
    this.links_ = Object.values(this.links_);
    this.cy.layout(this.DAGRE_OPTS).run();
    this.cy.fit(undefined, 20);
  }
}

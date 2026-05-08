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
  layoutSettings = { orientation: 'LR' };

  observacion_: 'SI' | 'NO' = 'NO';
  archivo_: 'SI' | 'NO' = 'NO';
  teso21_: Teso21;
  teso21get_: Teso21get;
  identity: any;

  /* ===== Vista Cytoscape ===== */
  @ViewChild('cyContainer', { static: false }) cyContainer!: ElementRef<HTMLDivElement>;
  useCytoscape = true;
  sidePanelOpen = true;
  wideGraph = false;
  layoutDirection: 'TB' | 'LR' = 'LR';
  readingMode = true;
  activeNodeLabel = '';
  activeNodeResume = '';
  private cy?: Core;
  private eh?: any; // edgehandles instance
  private activeNodeId = '';
  private readonly minReadableZoom = 0.82;

  DAGRE_OPTS: any = {
    name: 'dagre',
    rankDir: 'LR',   // 'TB' | 'BT' | 'LR' | 'RL'
    nodeSep: 78,
    edgeSep: 42,
    rankSep: 165,
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
        this.wideGraph = true;
        this.sidePanelOpen = false;
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

  toggleSidePanel(): void {
    this.sidePanelOpen = !this.sidePanelOpen;
    setTimeout(() => this.fitGraph(), 250);
  }

  toggleWideGraph(): void {
    this.wideGraph = !this.wideGraph;
    this.sidePanelOpen = !this.wideGraph;
    setTimeout(() => this.fitGraph(), 250);
  }

  setLayoutDirection(direction: 'TB' | 'LR'): void {
    this.layoutDirection = direction;
    this.layoutSettings = { orientation: direction };
    this.DAGRE_OPTS = {
      ...this.DAGRE_OPTS,
      rankDir: direction,
      nodeSep: direction === 'LR' ? 78 : 66,
      edgeSep: direction === 'LR' ? 42 : 34,
      rankSep: direction === 'LR' ? 165 : 142
    };
    this.applyLayoutAndFit();
  }

  fitGraph(padding = 90, keepReadable = true): void {
    if (!this.cy || this.cy.elements().length === 0) return;
    this.cy.resize();
    this.cy.fit(undefined, padding);
    if (keepReadable) this.keepReadableZoom();
  }

  overviewGraph(): void {
    this.fitGraph(36, false);
  }

  zoomGraph(factor: number): void {
    if (!this.cy) return;

    const current = this.cy.zoom();
    const next = Math.max(0.18, Math.min(2.4, current * factor));
    const rect = this.cyContainer?.nativeElement?.getBoundingClientRect();

    this.cy.zoom({
      level: next,
      renderedPosition: {
        x: (rect?.width || 900) / 2,
        y: (rect?.height || 650) / 2
      }
    });
  }

  focusSelected(): void {
    if (!this.cy) return;

    const selected = this.cy.$(':selected');
    if (selected.length === 0) {
      this.fitGraph();
      return;
    }

    const selectedNode = selected.nodes()[0] as NodeSingular | undefined;
    if (selectedNode) {
      this.focusNodeRoute(selectedNode);
      return;
    }

    this.cy.fit(selected.closedNeighborhood(), 80);
    this.keepReadableZoom();
  }

  toggleReadingMode(): void {
    this.readingMode = !this.readingMode;
    if (this.activeNodeId && this.cy) {
      const node = this.cy.$id(this.activeNodeId)[0] as NodeSingular | undefined;
      if (node) this.focusNodeRoute(node, false);
    }
  }

  clearFocus(): void {
    this.activeNodeId = '';
    this.activeNodeLabel = '';
    this.activeNodeResume = '';
    this.clearHighlight(false);
  }

  private initCy(): void {
    if (!this.cyContainer) return;

    this.cy = cytoscape({
      container: this.cyContainer.nativeElement,
      elements: this.toCyElements(),
      layout: this.DAGRE_OPTS,
      minZoom: 0.16,
      maxZoom: 2.8,
      wheelSensitivity: 0.2,
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'round-rectangle',
            'background-color': (ele: NodeSingular) => ele.data('color') || '#ffffff',
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '170px',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 13,
            'font-weight': 600,
            'color': '#0f172a',
            'width': 205,
            'height': 76,
            'border-width': 2,
            'border-color': (ele: NodeSingular) => ele.data('borderColor') || '#94a3b8',
            'padding': '8',
            'text-outline-color': '#ffffff',
            'text-outline-width': 1
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'taxi',
            'taxi-direction': 'auto',
            'taxi-turn': 42,
            'taxi-turn-min-distance': 14,
            'line-color': (ele: EdgeSingular) => this.edgeColor(ele),
            'width': (ele: EdgeSingular) => ele.data('archivo') === 'SI' ? 6 : 4,
            'target-arrow-shape': 'triangle',
            'target-arrow-color': (ele: EdgeSingular) => this.edgeColor(ele),
            'arrow-scale': 1.35,
            'line-style': (ele: EdgeSingular) => ele.data('observacion') === 'SI' ? 'dashed' : 'solid',
            'line-cap': 'round',
            'source-endpoint': 'outside-to-node',
            'target-endpoint': 'outside-to-node',
            'opacity': 0.95,
            'label': (ele: EdgeSingular) => ele.data('label') || '',
            'font-size': 11,
            'color': '#334155',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.92,
            'text-background-padding': '3px'
          }
        },
        { selector: 'node.highlighted', style: { 'border-width': 4, 'border-color': '#2563eb', 'background-color': '#dbeafe' } },
        { selector: 'edge.highlighted', style: { 'line-color': '#2563eb', 'target-arrow-color': '#2563eb', 'opacity': 1, 'width': 6 } },
        { selector: '.dimmed', style: { 'opacity': 0.1 } },
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
          content: 'Eliminar',
          tooltipText: 'Eliminar nodo',
          selector: 'node',
          onClickFunction: (event: any) => {
            const node = event.target;
            this.eliminar_nodo({ id: node.id() });
            node.remove();
            this.applyLayoutAndFit();
          },
          hasTrailingDivider: true
        },
        {
          id: 'delete-edge',
          content: 'Eliminar enlace',
          tooltipText: 'Eliminar enlace',
          selector: 'edge',
          onClickFunction: (event: any) => {
            const edge = event.target;
            this.links_ = this.links_.filter(l => String(l.id) !== String(edge.id()));
            edge.remove();
            this.applyLayoutAndFit();
          }
        }
      ]
    });

    // Highlight/atenuación
    this.cy.on('mouseover', 'edge', (evt) => this.highlightEdge(evt.target));
    this.cy.on('mouseout', 'edge', () => this.restoreNodeFocus());
    this.cy.on('tap', 'node', (evt) => this.focusNodeRoute(evt.target));
    this.cy.on('tap', (evt) => {
      if (evt.target === this.cy) this.clearFocus();
    });

    this.applyLayoutAndFit();
  }

  private destroyCy(): void {
    try { if (this.eh) this.eh.destroy(); } catch { }
    try { if (this.cy) this.cy.destroy(); } catch { }
    this.cy = undefined;
    this.eh = undefined;
  }

  private toCyElements(): ElementDefinition[] {
    const incoming = new Set((this.links_ || []).map((l: any) => String(l.target)));
    const outgoing = new Set((this.links_ || []).map((l: any) => String(l.source)));

    const nodes: ElementDefinition[] = (this.nodes_ || []).map((n: any) => ({
      data: {
        id: String(n.id),
        label: n.label,
        color: n.data?.color || this.nodeColorByRole(this.nodeRole(String(n.id), incoming, outgoing)),
        borderColor: this.nodeBorderByRole(this.nodeRole(String(n.id), incoming, outgoing))
      }
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
    if (ele.data('archivo') === 'SI') return '#2563eb';
    if (ele.data('observacion') === 'SI') return '#a855f7';
    return '#475569';
  }

  private refreshCy(): void {
    if (!this.cy) return;
    const eles = this.toCyElements();
    this.cy.elements().remove();
    this.cy.add(eles);
    this.applyLayoutAndFit();
  }

  private applyLayoutAndFit(): void {
    if (!this.cy) return;
    this.cy.resize();
    this.cy.layout(this.DAGRE_OPTS).run();
    setTimeout(() => this.fitGraph(), 0);
  }

  private keepReadableZoom(): void {
    if (!this.cy || this.cy.nodes().length === 0 || this.cy.zoom() >= this.minReadableZoom) return;

    const rect = this.cyContainer?.nativeElement?.getBoundingClientRect();
    this.cy.zoom({
      level: this.minReadableZoom,
      renderedPosition: {
        x: (rect?.width || 900) / 2,
        y: (rect?.height || 650) / 2
      }
    });
    this.cy.center();
  }

  private nodeRole(id: string, incoming: Set<string>, outgoing: Set<string>): 'start' | 'end' | 'isolated' | 'process' {
    const hasIncoming = incoming.has(id);
    const hasOutgoing = outgoing.has(id);

    if (!hasIncoming && !hasOutgoing) return 'isolated';
    if (!hasIncoming) return 'start';
    if (!hasOutgoing) return 'end';
    return 'process';
  }

  private nodeColorByRole(role: 'start' | 'end' | 'isolated' | 'process'): string {
    const colors = {
      start: '#dbeafe',
      process: '#ffffff',
      end: '#dcfce7',
      isolated: '#fef3c7'
    };
    return colors[role];
  }

  private nodeBorderByRole(role: 'start' | 'end' | 'isolated' | 'process'): string {
    const colors = {
      start: '#2563eb',
      process: '#94a3b8',
      end: '#16a34a',
      isolated: '#d97706'
    };
    return colors[role];
  }

  // UX highlight
  private highlightEdge(edge: EdgeSingular): void {
    if (!this.cy) return;
    this.clearHighlight(false);
    edge.addClass('highlighted');
    edge.source().addClass('highlighted');
    edge.target().addClass('highlighted');
    this.cy.elements().difference(edge.closedNeighborhood()).addClass('dimmed');
  }

  private focusNodeRoute(node: NodeSingular, fit = true): void {
    if (!this.cy) return;

    this.activeNodeId = node.id();
    this.activeNodeLabel = node.data('label') || node.id();

    const incoming = node.incomers('edge').length;
    const outgoing = node.outgoers('edge').length;
    this.activeNodeResume = `${incoming} entradas / ${outgoing} salidas`;

    this.clearHighlight(false);

    const focusArea = this.readingMode
      ? this.focusAreaByDepth(node, 2)
      : node.closedNeighborhood();

    focusArea.addClass('highlighted');
    this.cy.elements().difference(focusArea).addClass('dimmed');

    if (fit) {
      this.cy.fit(focusArea, 110);
      this.keepReadableZoom();
    }
  }

  private restoreNodeFocus(): void {
    if (!this.cy || !this.activeNodeId) {
      this.clearHighlight(false);
      return;
    }

    const node = this.cy.$id(this.activeNodeId)[0] as NodeSingular | undefined;
    if (node) this.focusNodeRoute(node, false);
  }

  private focusAreaByDepth(node: NodeSingular, depth: number): any {
    let area = node.closedNeighborhood();
    let frontier = node.neighborhood('node');

    for (let level = 1; level < depth && frontier.length > 0; level++) {
      const edges = frontier.connectedEdges();
      const nodes = edges.connectedNodes();
      const nextFrontier = nodes.difference(area);
      area = area.union(edges).union(nodes);
      frontier = nextFrontier;
    }

    return area;
  }

  private clearHighlight(clearActive = true): void {
    if (!this.cy) return;
    this.cy.elements().removeClass('highlighted dimmed');
    if (clearActive) {
      this.activeNodeId = '';
      this.activeNodeLabel = '';
      this.activeNodeResume = '';
    }
  }

  // Util para NGX (gradiente de arista)
  getNodeColor(nodeId: string): string {
    const n = (this.nodes_ || []).find((x: any) => String(x.id) === String(nodeId));
    if (n?.data?.color) return n.data.color;

    const incoming = new Set((this.links_ || []).map((l: any) => String(l.target)));
    const outgoing = new Set((this.links_ || []).map((l: any) => String(l.source)));
    return this.nodeBorderByRole(this.nodeRole(String(nodeId), incoming, outgoing));
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
    this.applyLayoutAndFit();
  }
}

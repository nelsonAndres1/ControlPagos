import { Component, OnInit } from '@angular/core';
import { MenuAccessService } from '../services/menu-access.service';

interface ManualSection {
  title: string;
  description: string;
  bullets: string[];
  requiredKeys?: string[];
}

@Component({
  selector: 'app-manual-usuario',
  templateUrl: './manual-usuario.component.html',
  styleUrls: ['./manual-usuario.component.scss']
})
export class ManualUsuarioComponent implements OnInit {
  public optionKeys: string[] = [];
  public sections: ManualSection[] = [];

  constructor(private menuAccessService: MenuAccessService) { }

  ngOnInit(): void {
    this.optionKeys = this.menuAccessService.getOptionKeys() || [];
    this.buildSections();
  }

  public get accessibleSections(): ManualSection[] {
    return this.sections.filter((section) => this.hasAccess(section.requiredKeys) && section.requiredKeys && section.requiredKeys.length > 0);
  }

  public get visibleSections(): ManualSection[] {
    return this.accessibleSections;
  }

  public get showLimitedAccessNotice(): boolean {
    return this.visibleSections.length <= 1;
  }

  public hasAccess(keys?: string[]): boolean {
    if (!keys || keys.length === 0) {
      return true;
    }
    return keys.some((key) => this.optionKeys.includes(key));
  }

  private buildSections(): void {
    this.sections = [
      {
        title: 'Página Principal',
        description: 'Es el punto de inicio donde se muestran accesos rápidos y el estado general del sistema.',
        bullets: [
          'Haz clic en «Pagina Principal» para volver al inicio.',
          'Desde aquí puedes acceder rápidamente a las opciones habilitadas.',
          'Verifica tu perfil y los mensajes del sistema cuando llegues a esta pantalla.'
        ],
        requiredKeys: ['principal']
      },
      {
        title: 'Radicar pago',
        description: 'Registra un nuevo pago en el sistema.',
        bullets: [
          'Haz clic en «Inicie el Pago».',
          'Completa los datos del pago: beneficiario, valor, fecha, tipo de pago y soporte asociado.',
          'Revisa que todos los campos obligatorios estén correctos.',
          'Guarda el pago para que quede registrado y comience el flujo de autorización.'
        ],
        requiredKeys: ['teso13_create']
      },
      {
        title: 'Editar pago',
        description: 'Modifica un pago que ya fue registrado.',
        bullets: [
          'Haz clic en «Editar sus pagos».',
          'Busca el pago que deseas actualizar.',
          'Modifica los campos necesarios y guarda los cambios.',
          'Asegúrate de mantener la información del pago consistente.'
        ],
        requiredKeys: ['teso13_edit']
      },
      {
        title: 'Editar soportes de pago',
        description: 'Actualiza los comprobantes asociados a un pago.',
        bullets: [
          'Haz clic en «Editar soportes de pago».',
          'Selecciona el soporte que quieras cambiar.',
          'Actualiza los datos o adjunta un nuevo archivo si es necesario.',
          'Guarda para que el soporte quede asociado al pago correctamente.'
        ],
        requiredKeys: ['teso13_supports_edit']
      },
      {
        title: 'Editar catálogo de soportes',
        description: 'Administra los tipos de soporte disponibles en el sistema.',
        bullets: [
          'Haz clic en «Editar Soportes» en el menú.',
          'Actualiza las categorías, nombres y la configuración de cada tipo de soporte.',
          'Guarda los cambios para que queden disponibles en los pagos nuevos.',
          'Útil cuando hay nuevos formatos de documento o comprobantes.'
        ],
        requiredKeys: ['editar_soportes_catalogo']
      },
      {
        title: 'Reimprimir pago',
        description: 'Genera nuevamente el comprobante o resumen de un pago.',
        bullets: [
          'Haz clic en «Reimprimir pago».',
          'Selecciona el pago que necesitas imprimir.',
          'Descarga o imprime el documento de soporte nuevamente.',
          'Es útil si necesitas un duplicado para archivo o control.'
        ],
        requiredKeys: ['teso13_reprint']
      },
      {
        title: 'Consultar modificaciones',
        description: 'Visualiza el historial de cambios de un pago.',
        bullets: [
          'Haz clic en «Consultar modificaciones».',
          'Selecciona el pago y revisa las actualizaciones realizadas.',
          'Verás quién cambió qué datos y cuándo se hizo el cambio.',
          'Útil para seguimiento y auditoría interna.'
        ],
        requiredKeys: ['teso13_changes_history']
      },
      {
        title: 'Consultar estado del pago',
        description: 'Revisa el estado actual de un pago dentro del proceso.',
        bullets: [
          'Haz clic en «Consultar estado del Pago».',
          'Busca el pago por número o referencia.',
          'Observa si está pendiente, autorizado, rechazado u otro estado.',
          'Sirve para ver el avance sin modificar el pago.'
        ],
        requiredKeys: ['teso15_status']
      },
      {
        title: 'Consultar por Nit',
        description: 'Busca pagos asociados a un NIT específico.',
        bullets: [
          'Haz clic en «Consultar por Nit».',
          'Ingresa el NIT del proveedor o entidad.',
          'Ejecuta la búsqueda y revisa los pagos asociados.',
          'Ideal para seguimiento de terceros o proveedores.'
        ],
        requiredKeys: ['teso15_nit']
      },
      {
        title: 'Modificar estado del pago',
        description: 'Ajusta el estado de un pago durante su trámite.',
        bullets: [
          'Haz clic en «Modificar estado del Pago».',
          'Busca el pago y elige el nuevo estado.',
          'Los administradores pueden retroceder el estado del pago al paso anterior.',
          'Confirma el cambio para que el proceso avance o se revierta.'
        ],
        requiredKeys: ['teso17_status_change']
      },
      {
        title: 'Tipos de Pago',
        description: 'Administra los métodos de pago que pueden usar los usuarios.',
        bullets: [
          'Haz clic en «Tipos de Pago».',
          'Agrega, edita o desactiva los tipos de pago disponibles.',
          'Asegúrate de que la lista coincida con los procesos contables.',
          'Guarda los cambios para que se apliquen en los formularios.'
        ],
        requiredKeys: ['tipos_pago']
      },
      {
        title: 'Tipos de Soportes',
        description: 'Gestiona los tipos de documentos o soportes válidos.',
        bullets: [
          'Haz clic en «Tipos de Soportes».',
          'Configura las clases de soporte que los pagos pueden usar.',
          'Actualiza etiquetas, descripciones o estados según sea necesario.',
          'Guarda para que estén disponibles en los formularios de pago.'
        ],
        requiredKeys: ['tipos_soporte']
      },
      {
        title: 'Vincular pagos y soportes',
        description: 'Relaciona pagos con sus comprobantes faltantes o posteriores.',
        bullets: [
          'Haz clic en «Vincular Pagos y Soportes».',
          'Busca el pago y el soporte correspondiente.',
          'Confirma la vinculación para respaldar el pago.',
          'Esta opción es útil cuando el soporte llega después del pago.'
        ],
        requiredKeys: ['vincular_pagos_soportes']
      },
      {
        title: 'Roles de Menu',
        description: 'Administra roles y permisos para las opciones del menú.',
        bullets: [
          'Haz clic en «Roles de Menu».',
          'Selecciona un rol para ver y cambiar sus opciones.',
          'Marca o desmarca permisos de menú y guarda los cambios.',
          'Asigna roles a usuarios para controlar su acceso.'
        ],
        requiredKeys: ['roles_menu_admin']
      },
      {
        title: 'Agregar causadores',
        description: 'Registra causadores que participan en la generación de pagos.',
        bullets: [
          'Haz clic en «Agregar Causadores».',
          'Completa los datos del causador y guarda el registro.',
          'Verifica la información antes de guardar.',
          'Los causadores se usan para identificar responsables del pago.'
        ],
        requiredKeys: ['causadores_admin']
      },
      {
        title: 'Revisores y Autorizadores',
        description: 'Administra usuarios que revisan y autorizan pagos.',
        bullets: [
          'Haz clic en «Revisores y Autorizadores».',
          'Asigna o quita usuarios del rol de revisor/autorizador.',
          'Confirma los cambios para que tengan efecto inmediato.',
          'Usa esta opción para controlar el flujo de aprobación.'
        ],
        requiredKeys: ['revisores_admin']
      },
      {
        title: 'Crear Opciones',
        description: 'Crea nuevas entradas para el menú del sistema.',
        bullets: [
          'Haz clic en «Crear Opciones».',
          'Define el código, nombre y destino de la nueva opción.',
          'Guarda para que la nueva entrada aparezca en el catálogo.',
          'Después asigna el permiso a los roles necesarios.'
        ],
        requiredKeys: ['crear_opciones']
      },
      {
        title: 'Crear Arbol',
        description: 'Configura el árbol de clasificación de pagos o procesos.',
        bullets: [
          'Haz clic en «Crear Arbol».',
          'Agrega nodos y relaciones según la estructura requerida.',
          'Guarda los cambios para que se despliegue en el módulo correspondiente.',
          'Este árbol se usa para organizar pagos y responsables.'
        ],
        requiredKeys: ['crear_arbol']
      },
      {
        title: 'Arbol y Pagos',
        description: 'Relaciona los elementos del árbol con los pagos registrados.',
        bullets: [
          'Haz clic en «Arbol y Pagos».',
          'Busca y vincula los pagos a los nodos del árbol.',
          'Confirma la asociación para tener trazabilidad.',
          'Útil para segmentar pagos por estructura organizacional.'
        ],
        requiredKeys: ['arbol_pagos']
      },
      {
        title: 'Permisos',
        description: 'Gestiona permisos legacy o especiales del sistema.',
        bullets: [
          'Haz clic en «Permisos».',
          'Revisa los permisos existentes y sus descripciones.',
          'Asigna o retira permisos cuando sea necesario.',
          'Este módulo se usa para controles avanzados de acceso.'
        ],
        requiredKeys: ['permisos_legacy']
      },
      {
        title: 'Reportes',
        description: 'Genera reportes estándar del sistema.',
        bullets: [
          'Haz clic en «Reportes».',
          'Selecciona el tipo de reporte que necesitas.',
          'Configura filtros y fechas según tu consulta.',
          'Descarga o imprime el reporte resultante.'
        ],
        requiredKeys: ['reportes']
      },
      {
        title: 'Reportes Dinamicos',
        description: 'Crea y consulta reportes personalizados en tiempo real.',
        bullets: [
          'Haz clic en «Reportes Dinamicos».',
          'Define los campos y filtros a incluir en el reporte.',
          'Ejecuta la consulta y revisa los resultados.',
          'Guarda configuraciones si necesitas repetir el reporte.'
        ],
        requiredKeys: ['reportes_dinamicos']
      },
      {
        title: 'Tablero',
        description: 'Muestra indicadores y métricas del control de pagos.',
        bullets: [
          'Haz clic en «Tablero».',
          'Revisa gráficos y resúmenes de los datos actuales.',
          'Usa el tablero para monitorizar el desempeño y la gestión.',
          'Filtra los resultados si hay opciones disponibles.'
        ],
        requiredKeys: ['tablero']
      },
      {
        title: 'Pasos Generales',
        description: 'Define y consulta pasos generales del proceso de pagos.',
        bullets: [
          'Haz clic en «Pasos Generales».',
          'Revisa la lista de pasos existentes.',
          'Crea o edita pasos según el flujo del proceso.',
          'Guarda para que los cambios se apliquen al sistema.'
        ],
        requiredKeys: ['pasos_generales']
      },
      {
        title: 'Administrador Soportes',
        description: 'Gestiona los soportes y documentos del sistema.',
        bullets: [
          'Haz clic en «Administrador Soportes».',
          'Busca soportes existentes y edita su información.',
          'Añade nuevos soportes o corrige los datos actuales.',
          'Guarda los cambios para que queden disponibles en el sistema.'
        ],
        requiredKeys: ['soportes_admin']
      },
      {
        title: 'Notificaciones',
        description: 'Configura alertas por correo para pagos y pasos específicos.',
        bullets: [
          'Haz clic en «Notificaciones».',
          'Busca el usuario o documento del destinatario.',
          'Ingresa el correo y selecciona los pagos y pasos a notificar.',
          'Guarda la configuración para activar la notificación automática.'
        ],
        requiredKeys: ['notificaciones']
      },
      {
        title: 'Chat interno',
        description: 'Comunícate con otros usuarios desde la aplicación.',
        bullets: [
          'Haz clic en «Chat».',
          'Crea una nueva conversación directa o grupal.',
          'Agrega participantes y envía mensajes.',
          'Revisa las conversaciones existentes y responde rápidamente.'
        ],
        requiredKeys: ['chat']
      }
    ];
  }
}

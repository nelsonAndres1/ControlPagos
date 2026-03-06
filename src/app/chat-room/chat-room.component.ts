import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TesoChatService } from '../services/tesochat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {

  id_conversacion: number = 0;
  mensajes: any[] = [];
  txt_mensaje: string = '';

  mySub: string = '';
  lastId: number = 0;
  pollingRef: any = null;

  loading: boolean = true;
  loadingText: string = 'Cargando conversación...';

  private ids = new Set<number>();

  @ViewChild('msgContainer') msgContainer!: ElementRef<HTMLDivElement>;

  constructor(private chatService: TesoChatService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.id_conversacion = parseInt(p['id'], 10) || 0;

      if (this.id_conversacion > 0) {
        // reset por cambio de conversación
        this.mensajes = [];
        this.txt_mensaje = '';
        this.lastId = 0;
        this.ids.clear();
        this.detenerPolling();

        this.loading = true;
        this.loadingText = 'Validando sesión...';

        this.chatService.whoAmI().subscribe({
          next: (resp) => {
            this.mySub = resp?.status === 'success'
              ? String(resp.sub || '')
              : this.getSubFromLocalIdentity();

            this.cargarHistorico();
          },
          error: () => {
            this.mySub = this.getSubFromLocalIdentity();
            this.cargarHistorico();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }

  private getSubFromLocalIdentity(): string {
    try {
      const raw = localStorage.getItem('identityControlPagos');
      if (!raw) return '';
      const id = JSON.parse(raw);
      return String(id?.sub ?? '');
    } catch {
      return '';
    }
  }

  private addMessage(m: any): void {
    const id = parseInt(m?.id_mensaje, 10);
    if (!isNaN(id)) {
      if (this.ids.has(id)) return;
      this.ids.add(id);
      this.lastId = Math.max(this.lastId, id);
    }
    this.mensajes.push(m);
  }

  private rebuildIdsAndLastId(): void {
    this.ids.clear();
    this.lastId = 0;
    for (const m of this.mensajes) {
      const id = parseInt(m?.id_mensaje, 10);
      if (!isNaN(id)) {
        this.ids.add(id);
        this.lastId = Math.max(this.lastId, id);
      }
    }
  }

  // ✅ NUEVO: marcar como leído (si hay lastId válido)
  private markRead(): void {
    if (!this.id_conversacion || this.id_conversacion <= 0) return;
    if (!this.lastId || this.lastId <= 0) return;

    this.chatService.markAsRead(this.id_conversacion, this.lastId).subscribe({
      next: () => { },
      error: () => { }
    });
  }

  cargarHistorico(): void {
    this.loading = true;
    this.loadingText = 'Cargando mensajes...';

    this.chatService.getMessages(this.id_conversacion, 50).subscribe({
      next: (resp) => {
        if (resp?.status === 'success') {
          const arr = (resp.data || []).slice().reverse();

          this.mensajes = [];
          for (const m of arr) this.addMessage(m);
          this.rebuildIdsAndLastId();

          this.loading = false;
          this.scrollToBottom();

          // ✅ Marcar leído al abrir conversación
          this.markRead();

          this.iniciarPolling();
        } else {
          this.loading = false;
          console.log('getMessages no success:', resp);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('getMessages error:', err);
      }
    });
  }

  iniciarPolling(): void {
    this.detenerPolling();

    this.pollingRef = setInterval(() => {
      if (document.hidden) return;

      this.chatService.getNewMessages(this.id_conversacion, this.lastId).subscribe({
        next: (resp) => {
          if (resp?.status === 'success' && Array.isArray(resp.data) && resp.data.length > 0) {
            for (const m of resp.data) this.addMessage(m);
            this.scrollToBottom();

            // ✅ Si llegaron mensajes y estás viendo la conversación, marcar leído
            this.markRead();
          }
        },
        error: (err) => console.error('getNewMessages error:', err)
      });
    }, 7000);
  }

  detenerPolling(): void {
    if (this.pollingRef) {
      clearInterval(this.pollingRef);
      this.pollingRef = null;
    }
  }

  enviar(): void {
    const text = (this.txt_mensaje || '').trim();
    if (!text) return;

    const localText = text;
    this.txt_mensaje = '';

    this.chatService.sendMessage(this.id_conversacion, localText).subscribe({
      next: (resp) => {
        if (resp?.status === 'success' && resp.data) {
          this.addMessage(resp.data);
          this.scrollToBottom();
          this.markRead();
        } else {
          console.log('sendMessage no success:', resp);
          this.txt_mensaje = localText;
        }
      },
      error: (err) => {
        console.error('sendMessage error:', err);
        this.txt_mensaje = localText;
      }
    });
  }

  isMine(m: any): boolean {
    return String(m?.usu_envia ?? '') === String(this.mySub ?? '');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (!this.msgContainer) return;
      const el = this.msgContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }

  trackByMsgId(index: number, item: any): any {
    return item?.id_mensaje ?? index;
  }
}
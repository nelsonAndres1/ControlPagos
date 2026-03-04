import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TesoChatService } from '../services/tesochat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  conversations: any[] = [];
  loading: boolean = false;

  newTitulo: string = '';
  newTipo: string = 'direct';

  // ✅ búsqueda y selección de participantes
  searchTerm: string = '';
  searching: boolean = false;
  searchResults: any[] = [];

  selectedParticipants: any[] = []; // [{usuario,cedtra,nombre}]

  private searchTimer: any = null;

  constructor(private chatService: TesoChatService, private router: Router) { }

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.loading = true;
    this.chatService.getConversations().subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp?.status === 'success') {
          this.conversations = resp.data || [];
        } else {
          this.conversations = [];
          console.log('getConversations no success:', resp);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('getConversations error:', err);
      }
    });
  }

  openConversation(c: any): void {
    const id = parseInt(c?.id_conversacion, 10);
    if (!isNaN(id)) {
      this.router.navigate(['/ChatRoom', id]);
    }
  }

  // -----------------------------
  // BÚSQUEDA PARTICIPANTES
  // -----------------------------
  onSearchChange(): void {
    const term = (this.searchTerm || '').trim();

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    if (term.length < 2) {
      this.searchResults = [];
      this.searching = false;
      return;
    }

    // debounce 300ms
    this.searchTimer = setTimeout(() => {
      this.searching = true;

      this.chatService.searchUsuario(term).subscribe({
        next: (resp) => {
          this.searching = false;
          this.searchResults = resp?.status === 'success' ? (resp.data || []) : [];
        },
        error: (err) => {
          this.searching = false;
          this.searchResults = [];
          console.error('searchUsuario error:', err);
        }
      });

    }, 300);
  }

  addParticipant(u: any): void {
    const key = String(u?.usuario ?? '').trim();
    if (!key) return;

    if (!this.selectedParticipants.some(x => String(x.usuario) === key)) {
      this.selectedParticipants.push(u);
    }

    this.searchResults = [];
    this.searchTerm = '';
  }

  removeParticipant(u: any): void {
    const key = String(u?.usuario ?? '').trim();
    this.selectedParticipants = this.selectedParticipants.filter(x => String(x.usuario) !== key);
  }

  // -----------------------------
  // CREAR CONVERSACIÓN
  // -----------------------------
  createConversation(): void {
    const titulo = (this.newTitulo || '').trim();
    const tipo = (this.newTipo || 'direct').trim();

    // participantes desde selección
    const parts = this.selectedParticipants.map(x => String(x.usuario));

    this.chatService.createConversation(titulo, tipo, parts).subscribe({
      next: (resp) => {
        if (resp?.status === 'success') {
          // reset form
          this.newTitulo = '';
          this.searchTerm = '';
          this.searchResults = [];
          this.selectedParticipants = [];

          // refrescar lista
          this.loadConversations();

          // abrir conversación creada
          const id = parseInt(resp.data?.id_conversacion, 10);
          if (!isNaN(id)) this.router.navigate(['/ChatRoom', id]);
        } else {
          console.log('createConversation no success:', resp);
        }
      },
      error: (err) => console.error('createConversation error:', err)
    });
  }
}
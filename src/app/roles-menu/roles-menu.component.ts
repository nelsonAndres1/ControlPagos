import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Gener02Service } from '../services/gener02.service';
import { MenuAccessService } from '../services/menu-access.service';

type RoleItem = { id: number; code: string; name: string; description: string; };
type OptionItem = { id: number; key: string; label: string; route: string; icon: string; };
type UserRoleItem = { id: number; code: string; name: string; description: string; usuario: string; };

@Component({
  selector: 'app-roles-menu',
  templateUrl: './roles-menu.component.html',
  styleUrls: ['./roles-menu.component.css']
})
export class RolesMenuComponent implements OnInit {
  identity: any;
  roles: RoleItem[] = [];
  options: OptionItem[] = [];
  selectedRole: RoleItem | null = null;
  selectedOptionKeys = new Set<string>();
  private lockedUserSearch = '';

  roleForm = {
    code: '',
    name: '',
    description: '',
  };

  userSearch = '';
  userResults: any[] = [];
  selectedUser: any = null;
  selectedUserRoles: UserRoleItem[] = [];

  constructor(
    private gener02Service: Gener02Service,
    private menuAccessService: MenuAccessService
  ) {
    this.identity = this.gener02Service.getIdentity();
  }

  ngOnInit(): void {
    this.loadCatalog();
  }

  private refreshCurrentProfileIfNeeded(usuario?: string | null) {
    const currentUser = this.identity?.sub ?? null;
    if (!currentUser || !usuario || currentUser !== usuario) {
      return;
    }

    this.menuAccessService.loadProfile(currentUser).subscribe({
      error: () => {
        this.menuAccessService.setFallbackProfile(currentUser);
      }
    });
  }

  loadCatalog() {
    this.menuAccessService.getCatalog().subscribe({
      next: (resp: any) => {
        this.roles = resp?.data?.roles ?? [];
        this.options = resp?.data?.options ?? [];

        if (this.selectedRole) {
          const reselected = this.roles.find(r => r.id === this.selectedRole?.id) ?? null;
          this.selectedRole = reselected;
          if (reselected) {
            this.selectRole(reselected);
          }
        }
      }
    });
  }

  selectRole(role: RoleItem) {
    this.selectedRole = role;
    this.selectedOptionKeys.clear();

    this.menuAccessService.getRoleOptions({ role_id: role.id }).subscribe({
      next: (resp: any) => {
        const keys = Array.isArray(resp?.data) ? resp.data : [];
        this.selectedOptionKeys = new Set(keys);
      }
    });
  }

  toggleOption(key: string, checked: boolean) {
    if (checked) this.selectedOptionKeys.add(key);
    else this.selectedOptionKeys.delete(key);
  }

  onUserSearchInput() {
    if (this.userSearch === this.lockedUserSearch) {
      return;
    }

    if (this.selectedUser && this.userSearch !== this.getSelectedUserLabel(this.selectedUser)) {
      this.selectedUser = null;
      this.selectedUserRoles = [];
    }

    this.searchUsers();
  }

  private getSelectedUserLabel(user: any): string {
    return `${user.usuario} - ${user.nombre}`;
  }

  saveRole() {
    const payload = {
      code: this.roleForm.code,
      name: this.roleForm.name,
      description: this.roleForm.description,
      usuario: this.identity?.sub ?? '',
    };

    this.menuAccessService.saveRole(payload).subscribe({
      next: (resp: any) => {
        Swal.fire('Informacion', resp?.message || 'Rol creado', resp?.status === 'success' ? 'success' : 'warning');
        this.roleForm = { code: '', name: '', description: '' };
        this.loadCatalog();
      },
      error: (err) => {
        Swal.fire('Error', err?.error?.message || 'No se pudo crear el rol', 'error');
      }
    });
  }

  saveSelectedOptions() {
    if (!this.selectedRole) {
      Swal.fire('Informacion', 'Seleccione un rol', 'info');
      return;
    }

    this.menuAccessService.saveRoleOptions({
      role_id: this.selectedRole.id,
      option_keys: Array.from(this.selectedOptionKeys),
    }).subscribe({
      next: (resp: any) => {
        Swal.fire('Informacion', resp?.message || 'Opciones actualizadas', 'success');
        this.refreshCurrentProfileIfNeeded(this.selectedUser?.usuario ?? this.identity?.sub ?? null);
      },
      error: (err) => {
        Swal.fire('Error', err?.error?.message || 'No se pudieron actualizar las opciones', 'error');
      }
    });
  }

  deleteSelectedRole() {
    if (!this.selectedRole) {
      Swal.fire('Informacion', 'Seleccione un rol', 'info');
      return;
    }

    Swal.fire({
      title: 'Eliminar rol',
      text: `Se eliminara el rol ${this.selectedRole.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.menuAccessService.deleteRole({ role_id: this.selectedRole?.id }).subscribe({
        next: (resp: any) => {
          Swal.fire('Informacion', resp?.message || 'Rol eliminado', 'success');
          this.refreshCurrentProfileIfNeeded(this.selectedUser?.usuario ?? null);
          this.selectedRole = null;
          this.selectedOptionKeys.clear();
          this.loadCatalog();
        },
        error: (err) => {
          Swal.fire('Error', err?.error?.message || 'No se pudo eliminar el rol', 'error');
        }
      });
    });
  }

  searchUsers() {
    const keyword = this.userSearch.trim();
    if (!keyword) {
      this.userResults = [];
      this.lockedUserSearch = '';
      return;
    }

    this.menuAccessService.searchUsers(keyword).subscribe({
      next: (resp: any) => {
        this.userResults = Array.isArray(resp) ? resp : [];
      }
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.userResults = [];
    this.userSearch = this.getSelectedUserLabel(user);
    this.lockedUserSearch = this.userSearch;
    this.loadSelectedUserRoles();
  }

  loadSelectedUserRoles() {
    if (!this.selectedUser?.usuario) {
      this.selectedUserRoles = [];
      return;
    }

    this.menuAccessService.getUserRoles({ usuario: this.selectedUser.usuario }).subscribe({
      next: (resp: any) => {
        this.selectedUserRoles = Array.isArray(resp?.data) ? resp.data : [];
      }
    });
  }

  assignSelectedRoleToUser() {
    if (!this.selectedRole || !this.selectedUser?.usuario) {
      Swal.fire('Informacion', 'Seleccione un rol y un usuario', 'info');
      return;
    }

    this.menuAccessService.assignUserRole({
      role_id: this.selectedRole.id,
      usuario: this.selectedUser.usuario,
      assigned_by: this.identity?.sub ?? '',
    }).subscribe({
      next: (resp: any) => {
        Swal.fire('Informacion', resp?.message || 'Rol asignado', 'success');
        this.loadSelectedUserRoles();
        this.refreshCurrentProfileIfNeeded(this.selectedUser?.usuario ?? null);
      },
      error: (err) => {
        Swal.fire('Error', err?.error?.message || 'No se pudo asignar el rol', 'error');
      }
    });
  }

  removeRoleFromUser(role: UserRoleItem) {
    if (!this.selectedUser?.usuario) return;

    this.menuAccessService.removeUserRole({
      role_id: role.id,
      usuario: this.selectedUser.usuario,
    }).subscribe({
      next: (resp: any) => {
        Swal.fire('Informacion', resp?.message || 'Rol retirado', 'success');
        this.loadSelectedUserRoles();
        this.refreshCurrentProfileIfNeeded(this.selectedUser?.usuario ?? null);
      },
      error: (err) => {
        Swal.fire('Error', err?.error?.message || 'No se pudo retirar el rol', 'error');
      }
    });
  }
}

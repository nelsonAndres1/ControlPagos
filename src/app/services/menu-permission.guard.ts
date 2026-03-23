import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Gener02Service } from './gener02.service';
import { MenuAccessService } from './menu-access.service';

@Injectable()
export class MenuPermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private gener02Service: Gener02Service,
    private menuAccessService: MenuAccessService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const identity = this.gener02Service.getIdentity();
    if (!identity) {
      this.router.navigate(['/login']);
      return false;
    }

    const menuKey = route.data?.['menuKey'];
    if (!menuKey) {
      return true;
    }

    if (menuKey === 'principal' && this.menuAccessService.getOptionKeys().length === 0) {
      return true;
    }

    if (this.menuAccessService.hasAccess(menuKey)) {
      return true;
    }

    this.router.navigate(['/principal']);
    return false;
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  user:any;
  private unsubscribe: Subscription[] = [];

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    //this.user = this.authService.user;

    // Suscribirse al currentUser$ para actualizaciones
    const subscr = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      console.log('Usuario actualizado en sidebar:', this.user);
    });
    this.unsubscribe.push(subscr);
  }

  showMenu(permisos: any = []): boolean {
    if (!this.user) {
      return false;
    }

    // Si es Super-Admin, mostrar todo
    if (this.isSuperAdmin()) {
      return true;
    }

    // Si no hay permisos requeridos, mostrar por defecto
    if (!permisos || permisos.length === 0) {
      return true;
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const userPermissions = this.user.permissions || [];

    for (const permiso of permisos) {
      if (userPermissions.includes(permiso)) {
        return true;
      }
    }

    return false;
  }
  isSuperAdmin(): boolean {
    if (!this.user) return false;

    // Verificar por is_super
    if (this.user.is_super === true) {
      return true;
    }

    // Verificar por roles (array)
    if (this.user.roles && Array.isArray(this.user.roles)) {
      return this.user.roles.includes('Super-Admin');
    }

    // Verificar por rol_name (backward compatibility)
    if (this.user.rol_name === 'Super-Admin') {
      return true;
    }

    return false;
  }

  isRole(){
     return this.user.rol_name == "Super-Admin" ? true : false;
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }

}

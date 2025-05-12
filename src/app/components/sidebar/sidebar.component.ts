import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';
import { CommonModule } from '@angular/common';
import { DynamicSidebarLinkComponent } from '../dynamic-sidebar-link/dynamic-sidebar-link.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DynamicSidebarLinkComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // <-- aquí está corregido
})
export class SidebarComponent implements OnInit {
  themeService = inject(DynamicThemeService);
  loginService = inject(LoginService);

  sidebarColor: ThemeColors['sidebar'] = {
    background: '#007bff',
    text: '#ffffff'
  };

  role: string = '';

  ngOnInit(): void {
    this.themeService.getSection('sidebar').subscribe(colors => {
      this.sidebarColor = colors;
    });

    this.role = this.loginService.getUserRole();
  }

  isAdmin(): boolean {
    return this.role === 'ADMINISTRADOR';
  }

  isCajero(): boolean {
    return this.role === 'VENDEDOR_CAJERO';
  }

  isCliente(): boolean {
    return this.role === 'CLIENTE';
  }

  isBodeguero(): boolean {
    return this.role === 'BODEGUERO';
  }
}

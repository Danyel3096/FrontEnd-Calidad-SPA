import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CartStateService } from '../../services/cart-state.service';
import { DynamicNavbarButtonComponent } from '../dynamic-navbar-button/dynamic-navbar-button.component';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { CompanyService } from '../../services/company.service';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarButtonsColors, ThemeColors } from '../../interfaces/dynamic-colors.interface';

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  fecha: Date;
  leido: boolean;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    NgbCollapseModule,
    NgbDropdownModule,
    DynamicNavbarButtonComponent
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  company = inject(CompanyService).getCompany();
  cartState = inject(CartStateService).state;
  login: LoginService = inject(LoginService); // Asegúrate de que el servicio está correctamente inyectado
  themeService = inject(DynamicThemeService);

  hoveredDropdownItem: number | string | null = null;
  isLoggedIn = false;
  user: any = null;

  activePalette!: ThemeColors;
  isNavbarCollapsed = true; // Controla el estado del colapso
  isHovered = false;

  // Notificaciones
  notificaciones: Notificacion[] = [
    {
      id: 1,
      titulo: 'Stock actualizado',
      mensaje: 'Se actualizó el producto "Monitor"',
      fecha: new Date(),
      leido: false
    },
    {
      id: 2,
      titulo: 'Producto eliminado',
      mensaje: 'El producto "Teclado" fue eliminado del inventario',
      fecha: new Date(new Date().getTime() - 3600000),
      leido: false
    },
    {
      id: 3,
      titulo: 'Nuevo producto agregado',
      mensaje: 'Se agregó "Mouse inalámbrico"',
      fecha: new Date(new Date().getTime() - 7200000),
      leido: true
    }
  ];

  constructor(private dynamicThemeService: DynamicThemeService) {}

  titleColor: ThemeColors['titleNavbar'] = { color: '#000' };

  navbarColor: ThemeColors['navbar'] = {
    background: '',
    text: ''
  };

  color: NavbarButtonsColors = {
    background: '#ccc',
    text: '#000',
    hoverBackground: '#bbb',
    hoverText: '#111'
  };

  ngOnInit(): void {
    // Estado de login
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();

    // Verificación de si el usuario existe y tiene la estructura esperada
    if (this.user) {
      console.log('Usuario actual:', this.user);  // Solo para depurar
    } else {
      console.log('No hay usuario logueado');
    }

    this.login.loginStatusSubject.subscribe(() => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });

    this.dynamicThemeService.getSection('navbar').subscribe(colors => {
      this.navbarColor = colors;
    });

    this.dynamicThemeService.getSection('navbarButtons').subscribe(colors => {
      this.color = colors;
    });

    this.dynamicThemeService.getSection('titleNavbar').subscribe(c => {
      this.titleColor = c;
    });

    this.themeService.getActivePalette().subscribe(palette => {
      this.activePalette = palette;
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  closeNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  logout(): void {
    this.login.logout();
    window.location.reload(); // Recarga la página para actualizar el estado
  }

  toggleTheme(): void {
    this.dynamicThemeService.toggleTheme();
  }

  // Notificaciones
  notificacionesSinLeer(): number {
    return this.notificaciones.filter(n => !n.leido).length;
  }

  marcarTodasComoLeidas(): void {
    this.notificaciones = this.notificaciones.map(n => ({ ...n, leido: true }));
  }
}

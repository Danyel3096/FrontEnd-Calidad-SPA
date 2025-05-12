import { Component, OnInit, Input, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarButtonsColors } from '../../interfaces/dynamic-colors.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'app-dynamic-navbar-button',
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './dynamic-navbar-button.component.html',
  styleUrls: ['./dynamic-navbar-button.component.css']  // corregido
})

export class DynamicNavbarButtonComponent implements OnInit {
  @Input() icon?: string;
  @Input() label = ''; 
  @Input() routerLink = ''; 
  @Input() routerLinkActive = 'active'; 
  @Input() isButtonOnly = false; // nueva bandera
  @Output() click = new EventEmitter<Event>();
  @Output() buttonClick = new EventEmitter<void>();

  isHovered = false;
  //color!: ButtonColors;

  private themeService = inject(DynamicThemeService);
  public router = inject(Router);

  color: NavbarButtonsColors = {
    background: '#ccc',
    text: '#000',
    hoverBackground: '#bbb',
    hoverText: '#111'
  };

  ngOnInit(): void {
    // Suscribirse a la sección 'button' de la paleta activa
    this.themeService.getSection('navbarButtons').subscribe(colors => {
      console.log('Button colors:', colors);
      this.color = colors;
    });
  }

  handleClick(event: Event): void {
    if (!this.routerLink) {
      event.preventDefault();
    }
    
    this.click.emit(event);
    this.buttonClick.emit();
  }

  isActiveRoute(): boolean {
    return this.router.url === this.routerLink;
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  themeService = inject(DynamicThemeService);

  activePalette!: ThemeColors;
  
  constructor(private dynamicThemeService: DynamicThemeService, /* … */) { }

  homePageColor: ThemeColors['homePage'] = {
    backgroundPrimary: '',
    backgroundSecondary: '',
    backgroundTertiary: '',
    backgroundQuaternary: '',
    textTitle: '',
    textBody: ''
  };

  ngOnInit(): void {
    // SUSCRÍBETE a la sección 'home page' del tema activo
    this.dynamicThemeService.getSection('homePage').subscribe(colors => {
      this.homePageColor = colors;
      console.log('Footer colors:', this.homePageColor);
    });
  }

}

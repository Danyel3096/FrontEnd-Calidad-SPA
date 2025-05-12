import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DynamicThemeService } from './services/dynamic-theme.service';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ThemeColors } from './interfaces/dynamic-colors.interface';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FontAwesomeModule, FooterComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  pageContentColors: ThemeColors['pageContent'] = {
      backgroundPage: '',
      backgroundSecondary: '',
      textTitle: '',
      textBody: '',
      fontFamily: '',
      fontSizeH1: '',
      fontSizeH2: '',
      fontSizeH3: '',
      fontSizeH4: '',
      fontSizeH5: '',
      fontSizeH6: '',
      fontSizeText: ''
    };

  constructor(private themeService: DynamicThemeService, library: FaIconLibrary) {
    library.addIconPacks(fas); // Agrega todos los íconos sólidos
  }

  ngOnInit(): void {
    this.themeService.getDarkMode().subscribe(isDark => {
      console.log('AppComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.themeService.getSection('pageContent').subscribe(colors => {
      console.log('AppComponent detectó pageContent:', colors);
      // Aplica los estilos globales al body o al root
      const root = document.documentElement;

      this.pageContentColors = colors;

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    });
  }
}

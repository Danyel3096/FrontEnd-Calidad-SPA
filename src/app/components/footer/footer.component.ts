import { Component, inject, OnInit } from '@angular/core';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';
import { CommonModule } from '@angular/common';
import { SocialMediaService, SocialMediaInfo } from '../../services/social-media.service';
import { CompanyService } from '../../services/company.service';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})

export class FooterComponent implements OnInit {
  company = inject(CompanyService).getCompany();
  socialMedia = inject(SocialMediaService).getSocialMedia();
  themeService = inject(DynamicThemeService);

  hoveredLinkItem: number | string | null = null;

  activePalette!: ThemeColors;

  constructor(private dynamicThemeService: DynamicThemeService, /* … */) {}

  footerColor: ThemeColors['footer'] = {
    background: '#1e293b',
    text: '#cbd5e1',
    hoverBackground: '#93c5fd',
    hoverText: '#60a5fa'
  };

  ngOnInit(): void {
    // SUSCRÍBETE a la sección 'footer' del tema activo
    this.dynamicThemeService.getSection('footer').subscribe(colors => {
      this.footerColor = colors;
      console.log('Footer colors:', this.footerColor);
    });
  }
}

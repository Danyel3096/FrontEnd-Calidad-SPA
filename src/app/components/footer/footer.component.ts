import { Component, inject, OnInit } from '@angular/core';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';
import { CommonModule } from '@angular/common';
import { SocialMediaService } from '../../services/social-media.service';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})

export class FooterComponent implements OnInit {
  WhatsAppUrl = 'https://api.whatsapp.com/send?phone=1234567890&text=Hola%20me%20interesa%20tu%20producto';
  FacebookUrl = 'https://facebook.com/tuPagina';
  XTwitterUrl = 'https://twitter.com/tuPagina';
  ThreadsUrl = 'https://threads.net/tuPagina';
  PinterestUrl = 'https://pinterest.com/tuPagina';
  LinkedInUrl = 'https://linkedin.com/company/tuPagina';
  YouTubeUrl = 'https://youtube.com/tuPagina';
  InstagramUrl = 'https://instagram.com/tuPagina';
  RedditUrl = 'https://reddit.com/user/tuUsuario';
  SnapchatUrl = 'https://snapchat.com/add/tuUsuario';
  TumblrUrl = 'https://tumblr.com/tuUsuario';
  VimeoUrl = 'https://vimeo.com/tuUsuario';
  GooglePlusUrl = 'https://plus.google.com/tuPagina';

  social_media = inject(SocialMediaService).getSocialMedia();
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

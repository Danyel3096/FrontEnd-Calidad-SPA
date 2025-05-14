import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  themeService = inject(DynamicThemeService);
  loginService = inject(LoginService);

  textTitleColor = '';
  textBodyColor = '';
  backgroundSecondary = '';
  fontFamily = '';
  fontSize = '';

  role = '';
  isAdmin = false;
  isVendedor = false;
  isCustomer = false;
  isBodeguero = false;

  ngOnInit(): void {
    this.themeService.getSection('pageContent').subscribe(colors => {
      this.textTitleColor = colors.textTitle;
      this.textBodyColor = colors.textBody;
      this.backgroundSecondary = colors.backgroundSecondary;
      this.fontFamily = colors.fontFamily;
      this.fontSize = colors.fontSizeH1;
      this.fontSize = colors.fontSizeH2;
      this.fontSize = colors.fontSizeH3;
      this.fontSize = colors.fontSizeH4;
      this.fontSize = colors.fontSizeH5;
      this.fontSize = colors.fontSizeH6;
      this.fontSize = colors.fontSizeText;
    });

   this.role = this.loginService.getUserRole() ?? '';


    this.isAdmin = this.role === 'ADMIN';
    this.isVendedor = this.role === 'VENDEDOR';
    this.isCustomer = this.role === 'CLIENTE';
    this.isBodeguero = this.role === 'BODEGUERO';
  }
}

import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompanyInfo {
  name: string;
  ruc: string;
  logo: string;
  slogan: string;
  telefono: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  private readonly company = signal<CompanyInfo | null>(null);

  constructor(private http: HttpClient) {
    this.loadCompanyInfo();
  }

  getCompany(): Signal<CompanyInfo | null> {
    return this.company;
  }

  private loadCompanyInfo(): void {
    this.http
      .get<CompanyInfo>('assets/config/company.json')
      .subscribe((data) => this.company.set(data));
  }
}

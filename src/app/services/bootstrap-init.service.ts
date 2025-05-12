import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root',
})
export class BootstrapInitService {
  constructor() {}

  /** Método público para inicializar tooltips y toasts */
  public initBootstrap(): void {
    this.initTooltips();
    this.initToasts();
  }

  private initTooltips(): void {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  private initToasts(): void {
    const toastElList = document.querySelectorAll('.toast');
    toastElList.forEach((toastEl) => {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    });
  }
}

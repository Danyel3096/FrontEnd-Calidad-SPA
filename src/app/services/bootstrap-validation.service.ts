import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BootstrapValidationService {
  constructor() {
    this.initializeValidation();
  }

  private initializeValidation(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.applyValidationToForms();
    });
  }

  private applyValidationToForms(): void {
    const forms = document.querySelectorAll('form.needs-validation');

    forms.forEach((form) => {
      form.addEventListener('submit', (event) => {
        if (!(form as HTMLFormElement).checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      });
    });
  }

  /**
   * Manually validate a specific form.
   * @param form The form element to validate.
   */
  public validateForm(form: HTMLFormElement): boolean {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return false;
    }
    form.classList.add('was-validated');
    return true;
  }
}

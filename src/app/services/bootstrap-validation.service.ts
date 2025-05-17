import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class BootstrapValidationService {
  /**
   * Marca el formulario como validado por Bootstrap.
   * Se debe llamar cuando el usuario intenta enviar o pasar de tab.
   */
  public validateAngularForm(formElement: HTMLElement): void {
    formElement.classList.add('was-validated');
  }

  /**
   * Limpia la validación de Bootstrap (ej. al cerrar un modal o reiniciar).
   */
  public resetValidation(formElement: HTMLElement): void {
    formElement.classList.remove('was-validated');
  }
}
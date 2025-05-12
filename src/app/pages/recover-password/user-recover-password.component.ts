import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-user-recover-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-recover-password.component.html',
  styleUrl: './user-recover-password.component.css'
})
export class UserRecoverPasswordComponent {
  
  public email: string = '';

  constructor() {}

  ngOnInit(): void {}

  formSubmit() {
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!this.email.trim()) {
      Swal.fire('Campo vacío', 'Por favor, ingresa tu correo.', 'warning');
      return;
    }

    if (!emailRegex.test(this.email)) {
      Swal.fire('Correo inválido', 'Ingresa un correo electrónico válido.', 'error');
      return;
    }

    // Aquí iría la lógica para enviar el correo de recuperación
    Swal.fire('¡Listo!', 'Se ha enviado un enlace a tu correo.', 'success');
    this.resetFields();
  }

  resetFields() {
    this.email = '';
  }
}

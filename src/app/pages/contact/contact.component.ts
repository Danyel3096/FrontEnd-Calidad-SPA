import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BootstrapInitService } from '../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../services/bootstrap-validation.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements AfterViewInit {

  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService
  ) {}

  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();
  }

  onSubmit() {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.contactForm.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingresa un correo electrónico válido.',
      });
      return;
    }

    if (this.contactForm.name && this.contactForm.email && this.contactForm.message) {
      // Aquí podrías enviar los datos a tu backend o servicio

      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Gracias por contactarnos. Te responderemos pronto.',
        confirmButtonColor: '#3085d6',
      });

      // Opcional: limpiar formulario
      this.contactForm = {
        name: '',
        email: '',
        message: ''
      };

      // 🔧 Quitar clases de validación para reiniciar formulario
      form.classList.remove('was-validated');

    } else {
      // Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos del formulario.',
        confirmButtonColor: '#d33',
      });
    }
  }
}

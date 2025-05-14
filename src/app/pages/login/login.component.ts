import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import { first } from 'rxjs';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = {
    email: '',
    password: ''
  };

  inputError = {
    email: false,
    password: false
  };

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  formSubmit() {
    // Validación básica
    this.inputError.email = this.loginData.email.trim() === '';
    this.inputError.password = this.loginData.password.trim() === '';

    if (this.inputError.email || this.inputError.password) {
      this.showAlert('Por favor, completa todos los campos.');
      return;
    }

    this.loginService.generateToken(this.loginData).subscribe({
      next: (data: any) => {
        const token = data.token;
        console.log('Token recibido:', token);
        try {
          const decoded: any = jwtDecode(token);
          const role = decoded.role;
          console.log('nombre decodificado:', decoded.firstName);
          console.log('apellido decodificado:', decoded.lastName);

          // Guardamos el usuario y el token
          this.loginService.setUser({
            sub: decoded.sub,
            id: decoded.id,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            token: token // guardamos el token también
          });

          this.showSuccess();

          // Redirigimos según el rol
          if (role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'VENDEDOR') {
            this.router.navigate(['/ventas']);
          } else if (role === 'BODEGUERO') {
            this.router.navigate(['/inventario']);
          } else if (role === 'CUSTOMER'){
            this.router.navigate(['/home']);
          }

          this.loginService.loginStatusSubject.next(true);

        } catch (error) {
          console.error('Token inválido:', error);
          this.showAlert('Token inválido. Intente nuevamente.');
        }
      },
      error: () => {
        this.showAlert('Credenciales inválidas. Intente nuevamente.');
      }
    });
  }

  showAlert(message: string) {
    const modalElement = document.getElementById('alertModal');
    if (modalElement) {
      (modalElement.querySelector('.modal-body p') as HTMLElement).innerText = message;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  showSuccess() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  resetFields() {
    this.loginData = { email: '', password: '' };
    this.inputError = { email: false, password: false };
  }
}

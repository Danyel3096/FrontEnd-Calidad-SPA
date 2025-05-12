import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = {
    username: '',
    password: ''
  };

  inputError = {
    username: false,
    password: false
  };

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  formSubmit() {
    this.inputError.username = this.loginData.username.trim() === '';
    this.inputError.password = this.loginData.password.trim() === '';

    if (this.inputError.username || this.inputError.password) {
      this.showAlert();
      return;
    }

    // Simulación de usuarios quemados
    const validUsers: any = {
      admin: { password: '1234', role: 'ADMINISTRADOR' },
      cajero: { password: '1234', role: 'VENDEDOR_CAJERO' },
      cliente: { password: '1234', role: 'CLIENTE' },
      bodeguero: { password: '1234', role: 'BODEGUERO' }
    };

    const user = validUsers[this.loginData.username];

    if (user && user.password === this.loginData.password) {
      const fakeToken = 'fake-jwt-token';
      this.loginService.loginUser(fakeToken);

      const fakeUser = {
        username: this.loginData.username,
        authorities: [{ authority: user.role }]
      };

        /*if (role === 'ADMIN') {
          this.router.navigate(['dashboard']);
        } else if (role === 'NORMAL') {
          this.router.navigate(['dashboard']);
        }*/
      this.loginService.setUser(fakeUser);
      const role = this.loginService.getUserRole();

      this.showSuccess();
      this.router.navigate(['admin-dashboard']);
      this.loginService.loginStatusSubject.next(true);
    } else {
      this.showAlert('Credenciales inválidas, intente nuevamente.');
    }
  }

  showAlert(message: string = 'Por favor, completa todos los campos.') {
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
    this.loginData.username = '';
    this.loginData.password = '';
    this.inputError.username = false;
    this.inputError.password = false;
  }
}

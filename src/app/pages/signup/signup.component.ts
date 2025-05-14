import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';

@Component({
  standalone: true,
  imports: [MaterialModule, FormsModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    createdAt: '',
    role: 'CUSTOMER',
    photoUrl: 'https://...',
    phoneNumber: '',
    status: true
  };

  public errores = {
    name: false,
    email: false,
    password: false,
    phoneNumber: false
  };

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  formSubmit() {
    let camposVacios = false;

    for (let campo in this.user) {
      if (typeof (this.user as any)[campo] === 'string' && (this.user as any)[campo].trim() === '') {
        if (this.errores.hasOwnProperty(campo)) {
          (this.errores as any)[campo] = true;
        }
        camposVacios = true;
      } else {
        if (this.errores.hasOwnProperty(campo)) {
          (this.errores as any)[campo] = false;
        }
      }
    }

    if (camposVacios) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    this.userService.createUser(this.user).subscribe(
      (data) => {
        Swal.fire('Éxito', 'Usuario registrado correctamente', 'success').then(() => {
          this.router.navigate(['/login']);
        });

        this.user = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          address: '',
          createdAt: '',
          role: 'CUSTOMER',
          photoUrl: 'https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png',
          phoneNumber: '',
          status: true
        };
      },
      (error) => {
        Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
      }
    );
  }

}

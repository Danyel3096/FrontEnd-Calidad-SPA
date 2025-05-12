import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [MaterialModule, FormsModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public user = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  public errores = {
    username: false,
    password: false,
    nombre: false,
    apellido: false,
    email: false,
    telefono: false,
    direccion: false

  };

  constructor(private userService: UserService, private snack: MatSnackBar) { }

  ngOnInit(): void { }

  formSubmit() {
    let camposVacios = false;

    // Verificar cada campo y marcar los que están vacíos
    for (let campo in this.user) {
      if ((this.user as any)[campo].trim() === '') {
        (this.errores as any)[campo] = true;
        camposVacios = true;
      } else {
        (this.errores as any)[campo] = false;
      }
    }

    if (camposVacios) {
      Swal.fire({
        icon: 'warning',
        title: '¡Campos vacíos!',
        html: `<p style="font-size: 16px; color: #555;">Por favor, completa todos los campos.</p>`,
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
      return;
    }

    this.userService.añadirUsuario(this.user).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          html: `<p style="font-size: 16px; color: #555;">Tu cuenta ha sido creada correctamente.</p>`,
          confirmButtonText: 'Continuar',
          customClass: {
            popup: 'animated fadeInDown'
          }
        });

        // Reiniciar los campos y errores después del registro exitoso
        this.user = {
          username: '',
          password: '',
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          direccion: ''
        };
        this.errores = {
          username: false,
          password: false,
          nombre: false,
          apellido: false,
          email: false,
          telefono: false,
          direccion: false
        };
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: '¡Error en el registro!',
          html: `<p style="font-size: 16px; color: #555;">Ha ocurrido un problema en el sistema. Intenta de nuevo más tarde.</p>`,
          confirmButtonText: 'Cerrar',
          customClass: {
            popup: 'animated shake'
          }
        });
      }
    );
  }
}

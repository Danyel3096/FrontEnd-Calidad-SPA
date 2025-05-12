import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { create, registerPlugin } from 'filepond';
import * as bootstrap from 'bootstrap';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';

registerPlugin(FilePondPluginImagePreview);

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
  imports: [CommonModule, FormsModule]
})



export class UserPageComponent implements AfterViewInit {
  editMode: boolean = false;

  // Datos del usuario
  user = {
    nombreUsuario: 'markotto',
    nombre: 'Mark',
    apellido: 'Otto',
    correo: 'mark',
    dominio: 'gmail.com',
    telefono: '3241594569',
    direccion: 'Av. Comuneros 23',
    fechaCreacion: '2024-01-01'
  };

  // Imagen de perfil inicial
  profileImageUrl: string = 'assets/no-user-img.png';

  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService
  ) {}

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();
  }

  enableEdit(): void {
    this.editMode = true;

    // Esperar al render del input file y crear FilePond
    setTimeout(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        create(input, {
          allowImagePreview: true,
          imagePreviewHeight: 150,
          stylePanelAspectRatio: "1",
          labelIdle: 'Arrastra tu imagen o <span class="filepond--label-action">Examinar</span>',
          stylePanelLayout: 'compact circle',
          styleLoadIndicatorPosition: 'center bottom',
          styleProgressIndicatorPosition: 'right bottom',
          styleButtonRemoveItemPosition: 'left bottom',
        });
      }
    }, 0);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    this.editMode = false;

    Swal.fire({
      icon: 'success',
      title: 'Perfil actualizado',
      text: 'Los cambios se han guardado correctamente',
      confirmButtonColor: '#198754'
    });
  }
}

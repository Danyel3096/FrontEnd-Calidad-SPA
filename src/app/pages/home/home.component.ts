import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//NUEVOS IMPORTS
import { User } from '../../interfaces/user.interface';
import { Store } from '../../interfaces/store.interface';
import { BootstrapValidationService } from '../../services/bootstrap-validation.service';
import Swal from 'sweetalert2';
import { StoreService } from '../../services/store.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})

export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('nav', { static: true }) nav!: NgbNav;
  @ViewChild('userFormEl') userFormEl!: ElementRef<HTMLFormElement>;
  @ViewChild('companyFormEl') companyFormEl!: ElementRef<HTMLFormElement>;

  activeTab = 1;
  companyEnabled = false;

  submittedUser = false;
  submittedStore = false;

  userForm: FormGroup;
  companyForm: FormGroup;

  // Interfaces
  selectedUser: User = {
    id: 0,
    email: '',
    password: '',
    role: 'ADMIN',
    photoUrl: '',
    status: true,
    createdAt: new Date().toISOString(),
    phoneNumber: '',
    firstName: '',
    lastName: '',
    address: '',
    storeId: 0
  };

  selectedStore: Store = {
    id: 0,
    name: '',
    url: '',
    email: '',
    contact: '',
    nit: '',
    logo: '',
    description: '',
    address: '',
    status: true,
    createdAt: new Date().toISOString(),
  };

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private bootstrapValidation: BootstrapValidationService,
    private storeService: StoreService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      nit: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('tempUser');
    const storedStore = localStorage.getItem('tempStore');

    if (storedUser) {
      this.selectedUser = JSON.parse(storedUser);
      this.userForm.patchValue(this.selectedUser);
    }

    if (storedStore) {
      this.selectedStore = JSON.parse(storedStore);
      this.companyForm.patchValue(this.selectedStore);
    }
  }

  ngAfterViewInit() {
    // Cada vez que cambie username…
    this.userForm
      .get('username')!
      .valueChanges
      .subscribe((value: string) => {
        // Si queda inválido y ya habíamos habilitado la pestaña 2:
        if (this.companyEnabled && this.userForm.invalid) {
          this.companyEnabled = false;  // inhabilita Tab 2
          this.activeTab = 1;             // vuelve al Tab 1
        }
      });
  }

  open(content: any) {
    this.activeTab = 1;
    this.submittedUser = false;
    this.companyEnabled = false;
    this.modalService
      .open(content, { size: 'lg' })
      .result.finally(() => this.resetWizard());
  }

  beforeChange(event: NgbNavChangeEvent) {
    if (event.nextId === 2 && this.userForm.invalid) {
      event.preventDefault();
      this.userForm.markAllAsTouched();
    }
  }

  goNext() {
    this.submittedUser = true;
    this.bootstrapValidation.validateAngularForm(this.userFormEl.nativeElement);

    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    // Copiar los valores del form al objeto
    this.selectedUser = {
      ...this.selectedUser,
      ...this.userForm.value
    };

    this.companyEnabled = true;
    this.activeTab = 2;
  }

  goPrevious() {
    // Vuelves a la pestaña 1
    this.activeTab = 1;
    // Inhabilitas la pestaña 2
    this.companyEnabled = false;
    // Opcional: ocultar mensajes de “must fill” hasta next
    this.submittedUser = false;
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file && this.selectedStore) {
      this.selectedStore.image = file;

      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        if (this.selectedStore !== null) {
          this.selectedStore.logo = preview;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Genera un string aleatorio de letras mayúsculas y minúsculas
   * @param length - Longitud del string que deseas generar
   * @returns string aleatorio
   */
  generarStringAleatorio(length: number): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let resultado = '';
    for (let i = 0; i < length; i++) {
      const indice = Math.floor(Math.random() * letras.length);
      resultado += letras[indice];
    }
    return resultado;
  }

  submitAll() {
    console.log('llamando a la función submitAll');
    this.submittedStore = true;

    this.bootstrapValidation.validateAngularForm(this.companyFormEl.nativeElement);
    
    if (this.companyForm.invalid) {
      console.warn('Formulario de empresa inválido:', this.companyForm.value);
      return;
    }

     this.selectedStore = {
      ...this.selectedStore,
      ...this.companyForm.value
    };

    // Aquí llamarías a tu servicio con ambos objetos
    console.log('User:', this.selectedUser);
    console.log('Store:', this.selectedStore);

    // Mostrar loading mientras se realiza la petición
    Swal.fire({
      title: 'Creando tienda...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Agregando valores por defecto
    this.selectedUser.role = 'ADMIN';
    //this.selectedUser.photoUrl = '';
    this.selectedUser.status = true;
    this.selectedStore.email = this.selectedUser.email;
    this.selectedStore.url = this.generarStringAleatorio(10);

    //Combinando los objetos
    const combined = { ...this.selectedStore, ...this.selectedUser };

    this.storeService.createStore(combined).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Tienda creada exitosamente',
          text: `ID: ${response.id} - ${response.name}`
        });

        this.modalService.dismissAll(); // Cierra el modal
        this.resetWizard(); // Limpia el formulario
      },
      error: (error) => {
        console.error('Error al crear la tienda:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la tienda',
          text: error?.error?.message || 'Algo salió mal. Intenta nuevamente.'
        });
      }
    });

    /*ESTO YA NO ES NECESARIO ENTONCES?
    if (!this.companyForm.valid || !this.bootstrapValidation.validateForm(formElement)) {
      this.companyForm.markAllAsTouched();
      return;
    }
    // …*/
  }

  private resetWizard() {
    this.userForm.reset();
    this.companyForm.reset();
    this.submittedUser = false;
    this.companyEnabled = false;
    this.activeTab = 1;

    this.bootstrapValidation.resetValidation(this.userFormEl.nativeElement);
    this.bootstrapValidation.resetValidation(this.companyFormEl.nativeElement);
  }
}

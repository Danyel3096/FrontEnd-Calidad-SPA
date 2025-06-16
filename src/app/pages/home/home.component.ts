import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbNav, NgbNavChangeEvent, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs/operators';

//NUEVOS IMPORTS
import { User } from '../../interfaces/user.interface';
import { Store } from '../../interfaces/store.interface';
import { BootstrapValidationService } from '../../services/bootstrap-validation.service';
import Swal from 'sweetalert2';
import { StoreService } from '../../services/store.service';
import { UserService } from '../../services/user.service';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';

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

  activePalette!: ThemeColors;

  pageContentColors: ThemeColors['pageContent'] = {
      backgroundPage: '',
      backgroundSecondary: '',
      textTitle: '',
      textBody: '',
      fontFamily: '',
      fontSizeH1: '',
      fontSizeH2: '',
      fontSizeH3: '',
      fontSizeH4: '',
      fontSizeH5: '',
      fontSizeH6: '',
      fontSizeText: ''
    };

  homePageColor: ThemeColors['homePage'] = {
    backgroundPrimary: '',
    backgroundSecondary: '',
    backgroundTertiary: '',
    backgroundQuaternary: '',
    textTitle: '',
    textBody: ''
  };

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
    store: 0
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
    private storeService: StoreService,
    private userService: UserService,
    private dynamicThemeService: DynamicThemeService,
    config: NgbModalConfig,
  ) {
    // customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
    
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
    this.dynamicThemeService.getDarkMode().subscribe(isDark => {
      console.log('StoresDashboardComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.dynamicThemeService.getSection('pageContent').subscribe(colors => {
      console.log('StoresDashboardComponent detectó pageContent:', colors);
      // Aplica los estilos globales al body o al root
      const root = document.documentElement;

      this.pageContentColors = colors;

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    });
    
    // SUSCRÍBETE a la sección 'home page' del tema activo
    this.dynamicThemeService.getSection('homePage').subscribe(colors => {
      this.homePageColor = colors;
      console.log('Footer colors:', this.homePageColor);
    });
    
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

  /*
  handleImageUpload(event: any) {
    const file = event.target.files[0];
    const inputName = event.target.name;

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;

      if (inputName === 'userPhoto' && this.selectedUser) {
        this.selectedUser.photoUrl = preview;
        this.selectedUser.image = file; //(si necesitas el archivo binario)
      } else if (inputName === 'storeLogo' && this.selectedStore) {
        this.selectedStore.logo = preview;
        this.selectedStore.image = file; //(si necesitas el archivo binario)
      }
    };

    reader.readAsDataURL(file);
  }
  */ 


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

  submitAll(selectedUser: any, selectedStore: any) {
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

    console.log('Store a crear:', this.selectedStore);

    //Combinando los objetos
    //const combined = { ...this.selectedStore, ...this.selectedUser };

    this.storeService.createStore(this.selectedStore).pipe(
      switchMap((storeResponse) => {
      const storeId = storeResponse.id; // Asegúrate que el backend devuelve el id
      console.log('Store ID que traigo del createStore:', storeId);
      selectedUser.store = storeId;
      return this.userService.createUser(selectedUser);
    }),
    switchMap((userResponse) => {
      const userId = userResponse.id; // Asegúrate que el backend devuelve el id
      console.log('User ID que traigo del createStore:', userId);
      // Opcional: ahora obtener el usuario recién creado si quieres hacer otra llamada
      return this.userService.getUserById(userId);
    }),
    switchMap((userResponse) => {
      const userId = userResponse.id; // Asegúrate que el backend devuelve el id
      console.log('Segundo User ID que traigo del createStore:', userId);
      // Aquí se llama al endpoint que ejecuta el script de deploy
      return this.storeService.deploySite();
    })
  ).subscribe({
      next: (deployResponse) => {
        Swal.fire({
          icon: 'success',
          title: 'Tienda y administrador creados y sitio desplegado exitosamente.',
          //text: `ID: ${userResponse.id} - ${userResponse.name}`
        });

        this.modalService.dismissAll(); // Cierra el modal
        this.resetWizard(); // Limpia el formulario
      },
      error: (error) => {
        console.error('Error en el proceso de creación del administrador y la tienda:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la tienda o desplegar el sitio',
          text: error?.error?.message || 'Algo salió mal. Intenta nuevamente.'
        });
      }
    });
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

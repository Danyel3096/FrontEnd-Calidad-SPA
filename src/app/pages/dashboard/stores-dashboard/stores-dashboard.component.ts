import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import Swal from 'sweetalert2';

import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';

@Component({
  standalone: true,
  selector: 'app-stores-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './stores-dashboard.component.html',
  styleUrl: './stores-dashboard.component.css'
})

export class StoresDashboardComponent {
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

  constructor(
      private bootstrapInit: BootstrapInitService,
      private bootstrapValidation: BootstrapValidationService,
      private idiomaService: DatatableLanguageService,
      private cd: ChangeDetectorRef,
      private themeService: DynamicThemeService
  ) {}

  selectedStore: any = null;
  tempStore: any = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view';
  storeModal: any;
  dataTable: any;

  stores = [
    { id: 1, user_id: '', name: 'Tienda 1A', url: 'url_tienda_1A', email: 'tienda_1a@mail.com', contact: 'Calle falsa 123', nit: '012345679', logo: '1234', description: 'Admin', address: 'adresses', status: 'Activa', deleted: '2024-03-01', created_at: '2024-03-01' },
    { id: 2, user_id: '', name: 'Tienda 2B', url: 'url_tienda_2B', email: 'tienda_2b@mail.com', contact: 'Calle falsa 456', nit: '9876543210', logo: 'abcd', description: 'Bodeguera', address: 'adresses', status: 'Activa', deleted: '2024-03-05', created_at: '2024-03-05' },
    { id: 3, user_id: '', name: 'Tienda 3C', url: 'url_tienda_3C', email: 'tienda_3c@mail.com', contact: 'Calle falsa 789', nit: '012345679', logo: '5678', description: 'Cajero', address: 'adresses', status: 'Activa', deleted: '2024-03-10', created_at: '2024-03-10' },
    { id: 4, user_id: '', name: 'Tienda 4D', url: 'url_tienda_4D', email: 'tienda_4d@mail.com', contact: 'Calle mocha ABC', nit: '9876543210', logo: 'efgh', description: 'Sinner', address: 'adresses', status: 'Activa', deleted: '2024-03-15', created_at: '2024-03-15' },
    { id: 5, user_id: '', name: 'Tienda 5E', url: 'url_tienda_5E', email: 'tienda_5e@mail.com', contact: 'Calle mocha DEF', nit: '012345679', logo: 'ijkl', description: 'Sinner', address: 'adresses', status: 'Activa', deleted: '2024-03-20', created_at: '2024-03-20' }
  ];

  ngOnInit(): void {
    this.themeService.getDarkMode().subscribe(isDark => {
      console.log('StoresDashboardComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.themeService.getSection('pageContent').subscribe(colors => {
      console.log('StoresDashboardComponent detectó pageContent:', colors);
      // Aplica los estilos globales al body o al root
      const root = document.documentElement;

      this.pageContentColors = colors;

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    });
  }

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();

    this.storeModal = new Modal(document.getElementById('storeModal')!);

    const modalEl = document.getElementById('storeModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedStore = null;
      this.modalMode = 'view';
    });

    this.initDataTable();
  }

  initDataTable(): void {
    
    this.dataTable = $('#storesTable').DataTable({
      language: this.idiomaService.getIdioma(),
      dom: "<'row'<'col-4'l><'col-4 d-flex justify-content-center'f><'col-4 text-end mb-2'B>>" +
           "<'row'<'col-12'tr>>" +
           "<'row'<'col-3'i><'col-6 d-flex justify-content-center'p><'col-3 text-end custom-button-col mt-2'>>",
      buttons: [
        { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'pdf', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' } }
      ],
      data: this.stores,
      columns: [
        /*{ data: 'id' },*/
        /*{ 
          data: null,
          render: data => `${data.first_name} ${data.last_name}`
        }*/
        { data: 'name' },
        { data: 'url' },
        { data: 'email' },
        { data: 'status' },
        { data: 'created_at' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-store" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-store" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-store" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        // Insertar botón "Crear tienda" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddStore" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear tienda</button>`;
        const btnHtml = `<button id="btnAddStore" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear tienda</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddStore').on('click', () => {
          this.createStore();
        });

        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.stores);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#storesTable').off('click', '.btn-see-store');
    $('#storesTable').off('click', '.btn-edit-store');
    $('#storesTable').off('click', '.btn-delete-store');

    $('#storesTable').on('click', '.btn-see-store', (e) => {
      const id = +$(e.currentTarget).data('id');
      const store = this.stores.find(u => u.id === id);
      if (store) this.seeStore(store);
    });

    $('#storesTable').on('click', '.btn-edit-store', (e) => {
      const id = +$(e.currentTarget).data('id');
      const store = this.stores.find(u => u.id === id);
      if (store) this.editStore(store);
    });

    $('#storesTable').on('click', '.btn-delete-store', (e) => {
      const id = +$(e.currentTarget).data('id');
      const store = this.stores.find(u => u.id === id);
      if (store) this.deleteStore(store);
    });
  }

  //OJO: Falta crear la función para crear un nuevo tienda, me basé en editStore para crear este ejemplo
  createStore(): void {
    this.selectedStore = {
      first_name: '',
      email: '',
      password: '',
      status: 'Activo',
      created_at: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.modalMode = 'create';
    this.storeModal.show();
  }

  seeStore(store: any): void {
    this.selectedStore = { ...store };
    this.modalMode = 'view';
    this.storeModal.show();
  }

  editStore(store: any): void {
    this.tempStore = { ...store }; // para edición
    this.selectedStore = { ...this.tempStore };
    this.modalMode = 'edit';
    this.storeModal.show();
  }

  deleteStore(store: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${store.first_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stores = this.stores.filter(u => u.id !== store.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'El tienda ha sido eliminado', 'success');
      }
    });
  }

  saveStoreChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedStore) return;

    if (this.modalMode === 'edit') {
      const index = this.stores.findIndex(u => u.id === this.selectedStore.id);
      if (index !== -1) {
        this.stores[index] = { ...this.selectedStore };
      }
    } else if (this.modalMode === 'create') {
      // Generar ID automático (consecutivo)
      const newId = this.stores.length ? Math.max(...this.stores.map(u => u.id)) + 1 : 1;
      const newStore = { ...this.selectedStore, id: newId };
      this.stores.push(newStore);
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.storeModal.hide();
  }
}

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

import { StoreService } from '../../../services/store.service';
import { Store } from '../../../interfaces/store.interface';

@Component({
  standalone: true,
  selector: 'app-stores-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './stores-dashboard.component.html',
  styleUrl: './stores-dashboard.component.css'
})

export class StoresDashboardComponent {
  stores: Store[] = [];
  selectedStore: Store | null = null;
  tempStore: Store | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';
  storeModal: any;
  dataTable: any;

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
      private themeService: DynamicThemeService,
      private storeService: StoreService
  ) {}

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

    this.loadStores();
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

  loadStores(): void {
    this.storeService.getAllStores().subscribe({
      next: (data) => {
        this.stores = data;
        if (this.dataTable) {
          this.redrawTable();
        } else {
          this.initDataTable();
        }
      },
      error: (err) => console.error('Error al cargar tiendas', err)
    });
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
      id: 0,
      user_id: 0,
      name: '',
      url: '',
      email: '',
      contact: '',
      nit: '',
      logo: '',
      description: '',
      address: '',
      status: 'Activa',
      deleted: '',
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
    this.selectedStore = { ...store };
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
    //if (!this.selectedStore) return;
    if (!this.tempStore) return;

    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (this.modalMode === 'edit' && this.tempStore.id) {
      this.storeService.updateStore(this.tempStore.id, this.tempStore).subscribe({
        next: () => {
          this.loadStores();
          this.storeModal.hide();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la tienda.', 'error')
      });
    } else if (this.modalMode === 'create') {
      this.storeService.createStore(this.tempStore).subscribe({
        next: (newStore) => {
          this.stores.push(newStore);
          this.redrawTable();
          this.storeModal.hide();
        },
        error: () => Swal.fire('Error', 'No se pudo crear la tienda.', 'error')
      });
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.storeModal.hide();
  }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-categories-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-dashboard.component.html',
  styleUrls: ['./categories-dashboard.component.css']
})

export class CategoriesDashboardComponent implements OnInit, AfterViewInit {
  
  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService
  ) {}
  
  selectedCategory: any = null; // Categoría seleccionada para ver/editar
  tempCategory: any = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view'; // Modo del modal
  categoryModal: any; // Referencia al modal
  dataTable: any;

  categories = [
    { id: 1, store_id: 101, name: 'Electrónica', description: 'Dispositivos electrónicos', status: 'Activo', created_at: '2024-03-01' },
    { id: 2, store_id: 102, name: 'Ropa', description: 'Prendas de vestir', status: 'Inactivo', created_at: '2024-03-05' },
    { id: 3, store_id: 103, name: 'Hogar', description: 'Artículos para el hogar', status: 'Activo', created_at: '2024-03-10' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();

    this.categoryModal = new Modal(document.getElementById('categoryModal')!);

    const modalEl = document.getElementById('categoryModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedCategory = null;
      this.modalMode = 'view';
    });

    this.initDataTable();
  }

  initDataTable(): void {
    this.dataTable = $('#categoriesTable').DataTable({
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
      data: this.categories,
      columns: [
        { data: 'id' },
        /*{ 
          data: null,
          render: data => `${data.first_name} ${data.last_name}`
        }*/
        { data: 'name' },
        { data: 'description' },
        { data: 'status' },
        { data: 'created_at' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-category" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-category" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-category" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        // Insertar botón "Crear categoría" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddCategory" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear categoría</button>`;
        const btnHtml = `<button id="btnAddCategory" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear categoría</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddCategory').on('click', () => {
          this.createCategory();
        });

        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.categories);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#categoriesTable').off('click', '.btn-see-category');
    $('#categoriesTable').off('click', '.btn-edit-category');
    $('#categoriesTable').off('click', '.btn-delete-category');

    $('#categoriesTable').on('click', '.btn-see-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.seeCategory(category);
    });

    $('#categoriesTable').on('click', '.btn-edit-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.editCategory(category);
    });

    $('#categoriesTable').on('click', '.btn-delete-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.deleteCategory(category);
    });
  }

  //OJO: Falta crear la función para crear un nueva categoría, me basé en editcategory para crear este ejemplo
  createCategory(): void {
    this.selectedCategory = {
      name: '',
      description: '',
      status: 'Activo',
      created_at: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.modalMode = 'create';
    this.categoryModal.show();
  }

  seeCategory(category: any): void {
    this.selectedCategory = { ...category };
    this.modalMode = 'view';
    this.categoryModal.show();
  }

  editCategory(category: any): void {
    this.tempCategory = { ...category }; // para edición
    this.selectedCategory = { ...this.tempCategory };
    this.modalMode = 'edit';
    this.categoryModal.show();
  }

  deleteCategory(category: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${category.first_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categories = this.categories.filter(u => u.id !== category.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'La categoría ha sido eliminado', 'success');
      }
    });
  }

  saveCategoryChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedCategory) return;

    if (this.modalMode === 'edit') {
      const index = this.categories.findIndex(u => u.id === this.selectedCategory.id);
      if (index !== -1) {
        this.categories[index] = { ...this.selectedCategory };
      }
    } else if (this.modalMode === 'create') {
      // Generar ID automático (consecutivo)
      const newId = this.categories.length ? Math.max(...this.categories.map(u => u.id)) + 1 : 1;
      const newCategory = { ...this.selectedCategory, id: newId };
      this.categories.push(newCategory);
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.categoryModal.hide();
  }
}

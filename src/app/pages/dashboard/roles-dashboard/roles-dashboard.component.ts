import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import 'datatables.net-bs5';
import Swal from 'sweetalert2';

import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-roles-dashboard',
  templateUrl: './roles-dashboard.component.html',
  styleUrls: ['./roles-dashboard.component.css']
})

export class RolesDashboardComponent implements OnInit, AfterViewInit {

  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService
  ) {}

  selectedUser: any = null;
  tempUser: any = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view';
  userModal: any;
  dataTable: any;

  users = [
    { id: 1, image: '', firstName: 'Juan', lastName: 'Polinecio', email: 'juan@mail.com', address: 'Calle falsa 123', phone: '012345679', password: '1234', role: 'Admin', status: 'Activo', createdAt: '2024-03-01' },
    { id: 2, image: '', firstName: 'Maria', lastName: 'Candela', email: 'maria@mail.com', address: 'Calle falsa 456', phone: '9876543210', password: 'abcd', role: 'Bodeguera', status: 'Inactivo', createdAt: '2024-03-05' },
    { id: 3, image: '', firstName: 'Carlos', lastName: 'Castaño', email: 'carlos@mail.com', address: 'Calle falsa 789', phone: '012345679', password: '5678', role: 'Vendedor', status: 'Activo', createdAt: '2024-03-10' },
    { id: 4, image: '', firstName: 'Joan', lastName: 'Sinner', email: 'joan@mail.com', address: 'Calle mocha ABC', phone: '9876543210', password: 'efgh', role: 'Customer', status: 'Activo', createdAt: '2024-03-15' },
    { id: 5, image: '', firstName: 'Sebastian', lastName: 'ReSinner', email: 'sebastian@mail.com', address: 'Calle mocha DEF', phone: '012345679', password: 'ijkl', role: 'Sinner', status: 'Inactivo', createdAt: '2024-03-20' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();

    this.userModal = new Modal(document.getElementById('userModal')!);

    const modalEl = document.getElementById('userModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedUser = null;
      this.modalMode = 'view';
    });

    this.initDataTable();
  }

  initDataTable(): void {
    this.dataTable = $('#usersTable').DataTable({
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
      data: this.users,
      columns: [
        /*{ data: 'id' },*/
        /*{ 
          data: null,
          render: data => `${data.firstName} ${data.lastName}`
        }*/
        { data: 'firstName' },
        { data: 'lastName' },
        { data: 'role' },
        { data: 'status' },
        { data: 'createdAt' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-user" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-user" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-user" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        // Insertar botón "Crear role" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddUser" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear role</button>`;
        const btnHtml = `<button id="btnAddUser" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear role</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddUser').on('click', () => {
          this.createUser();
        });

        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.users);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#usersTable').off('click', '.btn-see-user');
    $('#usersTable').off('click', '.btn-edit-user');
    $('#usersTable').off('click', '.btn-delete-user');

    $('#usersTable').on('click', '.btn-see-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find(u => u.id === id);
      if (user) this.seeUser(user);
    });

    $('#usersTable').on('click', '.btn-edit-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find(u => u.id === id);
      if (user) this.editUser(user);
    });

    $('#usersTable').on('click', '.btn-delete-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find(u => u.id === id);
      if (user) this.deleteUser(user);
    });
  }

  //OJO: Falta crear la función para crear un nuevo usuario, me basé en editUser para crear este ejemplo
  createUser(): void {
    this.selectedUser = {
      firstName: '',
      email: '',
      password: '',
      status: 'Activo',
      createdAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.modalMode = 'create';
    this.userModal.show();
  }

  seeUser(user: any): void {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.userModal.show();
  }

  editUser(user: any): void {
    this.tempUser = { ...user }; // para edición
    this.selectedUser = { ...this.tempUser };
    this.modalMode = 'edit';
    this.userModal.show();
  }

  deleteUser(user: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${user.firstName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      }
    });
  }

  saveUserChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedUser) return;

    if (this.modalMode === 'edit') {
      const index = this.users.findIndex(u => u.id === this.selectedUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
      }
    } else if (this.modalMode === 'create') {
      // Generar ID automático (consecutivo)
      const newId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
      const newUser = { ...this.selectedUser, id: newId };
      this.users.push(newUser);
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.userModal.hide();
  }
}

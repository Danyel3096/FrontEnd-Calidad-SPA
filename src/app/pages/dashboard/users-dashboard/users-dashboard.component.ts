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

import { User } from '../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css'],
  providers: [DatePipe],
})
export class UsersDashboardComponent implements OnInit, AfterViewInit {

  constructor(
      private usersService: UserService,
      private bootstrapInit: BootstrapInitService,
      private bootstrapValidation: BootstrapValidationService,
      private idiomaService: DatatableLanguageService,
      private datePipe: DatePipe
  ) {}

  selectedUser: User | null = null;
  tempUser: User | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';
  userModal: any;
  dataTable: any;
  users: User[] = [];
  storeId: number = 2;

  ngOnInit(): void {
    this.getUsers();
  }

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

  getUsers(): void {
    this.usersService.getUsersByStore(this.storeId).subscribe({
      next: (data) => {
        this.users = data;
        console.log("Usuarios cargados:", this.users);
        this.redrawTable();
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
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
        { data: 'firstName' },
        { data: 'lastName' },
        { data: 'email' },
        { 
          data: 'status',
          render: data => data ? 'Activo' : 'Inactivo'
        },
        { data: 'address' },
        { 
          data: 'createdAt',
          render: data => this.datePipe.transform(data, 'dd/MM/yyyy')
         },
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
        const btnHtml = `<button id="btnAddUser" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear usuario</button>`;
        $('.custom-button-col').append(btnHtml);
        $('#btnAddUser').on('click', () => this.createUser());
        this.bindTableActions();
      }
    });
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

  createUser(): void {
    this.selectedUser = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      role: '',
      status: true,
      createdAt: new Date().toISOString(),
      photoUrl: ''
    };
    this.modalMode = 'create';
    this.userModal.show();
  }
  

  seeUser(user: User): void {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.userModal.show();
  }

  editUser(user: User): void {
    this.tempUser = { ...user };
    this.selectedUser = { ...this.tempUser };
    this.modalMode = 'edit';
    this.userModal.show();
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${user.firstName} ${user.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(user.id!).subscribe(() => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.redrawTable();
          Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
        });
      }
    });
  }

  saveUserChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedUser) return;

    if (this.modalMode === 'edit') {
      console.log('Editando usuario:', this.selectedUser);
      this.usersService.updateUser(this.selectedUser!.id!, this.selectedUser!).subscribe(updatedUser => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
        this.redrawTable();
        this.userModal.hide();
      });
    } else if (this.modalMode === 'create') {
      this.usersService.createUser(this.selectedUser).subscribe(newUser => {
        this.users.push(newUser);
        Swal.fire('Guardado', 'El nuevo usuario ha sido creado', 'success');
        this.redrawTable();
        this.userModal.hide();
      });
    }
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.users);
    this.dataTable.draw();
    this.bindTableActions();
  }
}


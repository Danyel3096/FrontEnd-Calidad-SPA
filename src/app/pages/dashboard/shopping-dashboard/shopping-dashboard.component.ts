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
  selector: 'app-shopping-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-dashboard.component.html',
  styleUrls: ['./shopping-dashboard.component.css']
})

export class ShoppingDashboardComponent {
  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService
  ) {}

  selectedOrder: any = null;
  tempOrder: any = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view';
  orderModal: any;
  dataTable: any;

  orders = [
    { id: 1, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Activo', deleted: false, created_at: '2024-03-01' },
    { id: 2, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Inactivo', deleted: false, created_at: '2024-03-05' },
    { id: 3, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Activo', deleted: false, created_at: '2024-03-10' },
    { id: 4, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Activo', deleted: false, created_at: '2024-03-15' },
    { id: 5, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Inactivo', deleted: false, created_at: '2024-03-20' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();

    this.orderModal = new Modal(document.getElementById('orderModal')!);

    const modalEl = document.getElementById('orderModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedOrder = null;
      this.modalMode = 'view';
    });

    this.initDataTable();
  }

  initDataTable(): void {
    this.dataTable = $('#ordersTable').DataTable({
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
      data: this.orders,
      columns: [
        /*{ data: 'id' },*/
        /*{ 
          data: null,
          render: data => `${data.first_name} ${data.last_name}`
        }*/
        { data: 'sale_date' },
        { data: 'payment_method' },
        { data: 'total_amount' },
        { data: 'status' },
        { data: 'created_at' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-order" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-order" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-order" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        // Insertar botón "Crear compra" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddOrder" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear compra</button>`;
        const btnHtml = `<button id="btnAddOrder" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear compra</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddOrder').on('click', () => {
          this.createOrder();
        });

        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.orders);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#ordersTable').off('click', '.btn-see-order');
    $('#ordersTable').off('click', '.btn-edit-order');
    $('#ordersTable').off('click', '.btn-delete-order');

    $('#ordersTable').on('click', '.btn-see-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(u => u.id === id);
      if (order) this.seeOrder(order);
    });

    $('#ordersTable').on('click', '.btn-edit-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(u => u.id === id);
      if (order) this.editOrder(order);
    });

    $('#ordersTable').on('click', '.btn-delete-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(u => u.id === id);
      if (order) this.deleteOrder(order);
    });
  }

  //OJO: Falta crear la función para crear un nuevo usuario, me basé en editOrder para crear este ejemplo
  createOrder(): void {
    this.selectedOrder = {
      first_name: '',
      email: '',
      password: '',
      status: 'Activo',
      created_at: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.modalMode = 'create';
    this.orderModal.show();
  }

  seeOrder(order: any): void {
    this.selectedOrder = { ...order };
    this.modalMode = 'view';
    this.orderModal.show();
  }

  editOrder(order: any): void {
    this.tempOrder = { ...order }; // para edición
    this.selectedOrder = { ...this.tempOrder };
    this.modalMode = 'edit';
    this.orderModal.show();
  }

  deleteOrder(order: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${order.first_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orders = this.orders.filter(u => u.id !== order.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      }
    });
  }

  saveOrderChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedOrder) return;

    if (this.modalMode === 'edit') {
      const index = this.orders.findIndex(u => u.id === this.selectedOrder.id);
      if (index !== -1) {
        this.orders[index] = { ...this.selectedOrder };
      }
    } else if (this.modalMode === 'create') {
      // Generar ID automático (consecutivo)
      const newId = this.orders.length ? Math.max(...this.orders.map(u => u.id)) + 1 : 1;
      const newOrder = { ...this.selectedOrder, id: newId };
      this.orders.push(newOrder);
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.orderModal.hide();
  }
}

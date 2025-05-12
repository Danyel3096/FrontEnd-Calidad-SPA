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

import { ProductsService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.interface';

import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';

@Component({
  selector: 'products-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})

export class ProductsDashboardComponent implements OnInit, AfterViewInit {
  
  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private cdRef: ChangeDetectorRef,
    private productService: ProductsService,
    private idiomaService: DatatableLanguageService
  ) { }

  selectedProduct: Product = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0,
    },
    stock: 0,
  };
  tempProduct: any = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view';
  productModal: any;
  dataTable: any;

  products: Product[] = [];

  /*products = [
    { id: 1, id_tienda: 101, nombre_producto: 'Laptop Dell', descripcion_producto: 'Laptop Core i7', precio_producto: 2500, stock_producto: 10, id_categoria: 2, id_Bodeguero: 5, estado: true, fecha_creacion: '2024-03-30', foto_producto: 'assets/img/laptop.jpg' },
    { id: 2, id_tienda: 102, nombre_producto: 'Mouse Gamer', descripcion_producto: 'Mouse RGB', precio_producto: 50, stock_producto: 50, id_categoria: 3, id_Bodeguero: 2, estado: true, fecha_creacion: '2024-03-28', foto_producto: 'assets/img/mouse.jpg' }
  ];*/

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();

    this.productModal = new Modal(document.getElementById('productModal')!);

    const modalEl = document.getElementById('productModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedProduct; // SE SUPONE: Limpiar el producto seleccionado
      this.modalMode = 'view';
    });

    this.initDataTable();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      console.log("EMPIEZA LISTA DE PRODUCTOS");
      console.log(this.products);
      this.products = data.map(product => ({
        ...product,
        stock: Math.floor(Math.random() * 100) // Simulación de stock
      }));
      this.redrawTable();
      //this.initDataTable();
    });
  }

  initDataTable(): void {
    this.dataTable = $('#productsTable').DataTable({
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
      data: this.products,
      columns: [
        /*{ data: 'id' },*/
        /*{ 
          data: null,
          render: data => `${data.first_name} ${data.last_name}`
        }*/
        { data: 'title' },
        {
          data: 'image',
          render: (data: string) => `<img src="${data}" alt="Imagen" class="img-thumbnail" style="max-height: 60px;" />`
        },
        /*{ data: 'descripcion' },*/
        { data: 'price' },
        { data: 'stock' },
        { data: 'estado' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-product" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-product" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-product" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        // Insertar botón "Crear producto" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddProduct" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear producto</button>`;
        const btnHtml = `<button id="btnAddProduct" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear producto</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddProduct').on('click', () => {
          this.createProduct();
        });

        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.products);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#productsTable').off('click', '.btn-see-product');
    $('#productsTable').off('click', '.btn-edit-product');
    $('#productsTable').off('click', '.btn-delete-product');

    $('#productsTable').on('click', '.btn-see-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find(p => p.id === id);
      if (product) this.seeProduct(product);
    });

    $('#productsTable').on('click', '.btn-edit-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find(p => p.id === id);
      if (product) this.editProduct(product);
    });

    $('#productsTable').on('click', '.btn-delete-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find(p => p.id === id);
      if (product) this.deleteProduct(product);
    });
  }

  //OJO: Falta crear la función para crear un nuevo usuario, me basé en editProduct para crear este ejemplo
  createProduct(): void {
    this.selectedProduct; // SE SUPONE Limpiar el producto seleccionado
    this.modalMode = 'create';
    this.productModal.show();
  }

  seeProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.modalMode = 'view';
    this.productModal.show();
  }

  editProduct(product: Product): void {
    this.tempProduct = { ...product }; // para edición
    this.selectedProduct = { ...this.tempProduct };
    this.modalMode = 'edit';
    this.productModal.show();
  }

  deleteProduct(product: Product): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${product.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.products = this.products.filter(p => p.id !== product.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
        //this.initDataTable(); // Recargar la tabla después de eliminar
      }
    });
  }

  saveProductChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedProduct) return;

    if (this.modalMode === 'edit') {
      const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
      if (index !== -1) {
        this.products[index] = { ...this.selectedProduct };
      }
    } else if (this.modalMode === 'create') {
      // Generar ID automático (consecutivo)
      const newId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      const newProduct = { ...this.selectedProduct, id: newId };
      this.products.push(newProduct);
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.productModal.hide();
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.selectedProduct) {
          this.selectedProduct.image = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  toggleProductStatus(product: any) {
    product.estado = !product.estado;
    this.cdRef.detectChanges();
  }
}

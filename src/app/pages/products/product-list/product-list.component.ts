import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { CartStateService } from '../../../services/cart-state.service';
import { ProductsService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.interface';
import { TabsColors } from '../../../interfaces/dynamic-colors.interface';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { DynamicPagePaginationComponent } from '../../../components/dynamic-page-pagination/dynamic-page-pagination.component';
import { DynamicPageTabsComponent } from '../../../components/dynamic-page-tabs/dynamic-page-tabs.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, DynamicPagePaginationComponent, DynamicPageTabsComponent],
  templateUrl: './product-list.component.html',
})
export default class ProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cartService = inject(CartStateService);

  allProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  categories: string[] = [];
  selectedCategory: string = 'all';

  hoveredTabItem: number | string | null = null;
  selectedTabItem: string | null = null;

  hoveredPage: number | null = null;
  itemsPerPage = 6;
  currentPage = 1;
  totalPages = 1;

  private themeService = inject(DynamicThemeService);

  color: TabsColors = {
      background: '#ccc',
      text: '#000',
      hoverBackground: '#bbb',
      hoverText: '#111'
    };

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();

    // Suscribirse a la sección 'button' de la paleta activa
    this.themeService.getSection('tabs').subscribe(colors => {
      console.log('Tabs colors:', colors);
      this.color = colors;
    });
  }

  loadCategories(): void {
    this.productsService.getCategories().subscribe((res: string[]) => {
      this.categories = ['all', ...res];
    });
  }

  loadAllProducts(): void {
    this.productsService.getAllProducts().subscribe((res: Product[]) => {
      this.allProducts = res;
      this.updatePagination();
    });
  }

  loadProductsByCategory(category: string): void {
    if (category === 'all') {
      this.loadAllProducts();
      return;
    }

    this.productsService.getProductsByCategory(category).subscribe((res: Product[]) => {
      this.allProducts = res;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
    this.setPaginatedProducts();
  }

  setPaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.allProducts.slice(start, end);
  }

  pageChanged(page: number | 'next' | 'previous'): void {
    if (page === 'previous' && this.currentPage > 1) {
      this.currentPage--;
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (typeof page === 'number') {
      this.currentPage = page;
    }
  
    this.setPaginatedProducts();
  }  

  addToCart(product: Product): void {
    this.cartService.state.add({ product, quantity: 1 });
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loadProductsByCategory(category);
  }
  
  selectTab(category: string): void {
    this.selectedTabItem = category;
    this.onCategoryChange(category); // si ya lo usabas para cambiar datos, se mantiene
  }
}

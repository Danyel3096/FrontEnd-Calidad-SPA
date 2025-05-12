import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseHttpService {
  getProducts(page: number, limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlProducts}`, {
      params: {
        limit: limit.toString(),
        page: page.toString(),
      },
    });
  }
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.API_URL}/products`, product);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrlProducts}/${id}`);//return this.http.get<Product>(`${environment.API_URL_PRODUCTO_READBYID}/${id}`);
  }

  // Nuevos métodos para categorías
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(environment.API_URL_CATEGORIA_READALL);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL}/products/category/${category}`);
  }

  // Método adicional para traer todos los productos sin paginación
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL_PRODUCTO_READALL}`);
  }

  // Método para eliminar productos (lógica)
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL_PRODUCTO_DELETELOGICALLY}/${id}`);
  }

  // Método para actualizar producto
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.API_URL_PRODUCTO_UPDATE}/${id}`, product);
  }
}

@Injectable({
  providedIn: 'root',
})
export class MockProductService {
  private suppliers: Products[] = [
    { id: 1, name: 'Product A', description: 'Lorem ipsum 1', category: 'Ropa' },
    { id: 2, name: 'Product B', description: 'Lorem ipsum 2', category: 'Hogar' },
    { id: 3, name: 'Product C', description: 'Lorem ipsum 3', category: 'Electronica' },
    { id: 4, name: 'Product D', description: 'Lorem ipsum 4', category: 'Ropa' },
  ];

  getProductsList(): Observable<Products[]> {
    return of(this.suppliers);
  }

  // Método simulado para categorías únicas
  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.suppliers.map(p => p.category))];
    return of(categories);
  }

  // Filtrar productos por categoría simulada
  getProductsByCategory(category: string): Observable<Products[]> {
    const filtered = this.suppliers.filter(p => p.category === category);
    return of(filtered);
  }
}

// Interfaz del mock
export interface Products {
  id: number;
  name: string;
  description: string;
  category: string;
}

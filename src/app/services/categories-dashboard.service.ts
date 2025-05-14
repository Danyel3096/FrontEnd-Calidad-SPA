import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = 'https://tdd-billing-backend.onrender.com/api'; // URL base actual

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las categorías para una tienda específica por ID
   * @param storeId - ID de la tienda
   * @returns Observable<Category[]>
   */
  getCategoriesByStore(storeId: number): Observable<Category[]> {
    const url = `${this.baseUrl}/categories/store/${storeId}`;
    return this.http.get<Category[]>(url);
  }

  deleteCategory(categoryId: number): Observable<void> {
    const url = `${this.baseUrl}/categories/${categoryId}`;
    return this.http.delete<void>(url);
  }

  UpdateCategory(categoryId: number, category: Category): Observable<Category> {
    const url = `${this.baseUrl}/categories/${categoryId}`;
    return this.http.put<Category>(url, category);
  }

  createCategory(category: Category): Observable<Category> {
    const url = `${this.baseUrl}/categories`;
    return this.http.post<Category>(url, category);
  }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../interfaces/store.interface';

@Injectable({
  providedIn: 'root'
})

export class StoreService {
  private url = 'https://tdd-billing-backend.onrender.com/api'; // Ajusta según tu backend
  ///api/categories/store/2

  constructor(private http: HttpClient) { }

  /*
  getAllStores(): Observable<Store[]> {
    const url = `${this.url}/stores`;
    return this.http.get<Store[]>(url);
  }
  */

  /**
   * Obtiene una tienda por su ID
   * @param id - ID de la tienda
   * @returns Observable<Store>
   */
  getStoreById(id: number): Observable<Store> {
    const url = `${this.url}/stores/${id}`;
    return this.http.get<Store>(url);
  }

  /**
   * Crea una nueva tienda
   * @param store - Datos de la tienda a crear
   * @returns Observable<Store>
   */
  createStore(store: Store): Observable<Store> {
    const url = `${this.url}/stores`;
    return this.http.post<Store>(url, store);
  }

  /**
   * Actualiza los datos de una tienda
   * @param id - ID de la tienda
   * @param store - Datos de la tienda a actualizar
   * @returns Observable<Store>
   */
  updateStore(id: number, store: Store): Observable<Store> {
    const url = `${this.url}/stores/${id}`;
    return this.http.put<Store>(url, store);
  }

  /*
  deleteStore(id: number): Observable<void> {
    const url = `${this.url}/stores/${id}`;
    return this.http.delete<void>(url);
  }
  */
}

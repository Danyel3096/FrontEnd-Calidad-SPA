import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../interfaces/store.interface';

import { of } from 'rxjs'; //OJO ELIMINAR SI NO SE USA

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
    const formData = new FormData();

    //delete user.photoUrl;
    //delete store.id;

    const file = store.image;
    delete store.image;
    delete store.logo;
    delete store.createdAt;
    const { id, ...storeWithoutId } = store;

    //const jsonBlob = new Blob([JSON.stringify(store)], { type: 'application/json' });
    const jsonBlob = new Blob([JSON.stringify(storeWithoutId)], { type: 'application/json' });
    formData.append('store', jsonBlob);
    //formData.append('store', JSON.stringify(store));

    if (file) {
      console.log('file:', file);
      formData.append('file', file);
    }
    //formData.append('user', userData);

    //return this.http.post<Store>(url, store);
    return this.http.post<Store>(url, formData);
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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../interfaces/store.interface';

@Injectable({
  providedIn: 'root'
})

export class StoreServiceService {
  private baseUrl = 'http://localhost:3000/api/stores'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  getAllStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.baseUrl);
  }

  getStoreById(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.baseUrl}/${id}`);
  }

  createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(this.baseUrl, store);
  }

  updateStore(id: number, store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.baseUrl}/${id}`, store);
  }

  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

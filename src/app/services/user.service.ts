import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://tdd-billing-backend.onrender.com/api'; // URL base actual

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los usuarios
   * @returns Observable<User[]>
   */
  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<User[]>(url);
  }

  /**
   * Obtiene los usuarios para una tienda específica por ID
   * @param storeId - ID de la tienda
   * @returns Observable<User[]>
   */
  getUsersByStore(storeId: number): Observable<User[]> {
    const url = `${this.baseUrl}/users/store/${storeId}`;
    return this.http.get<User[]>(url);
  }

  /**
   * Obtiene un usuario por su ID
   * @param userId - ID del usuario
   * @returns Observable<User>
   */
  getUserById(userId: number): Observable<User> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.get<User>(url);
  }

  /**
   * Crea un nuevo usuario
   * @param user - Datos del usuario a crear
   * @returns Observable<User>
   */
  createUser(user: User): Observable<User> {
    const url = `${this.baseUrl}/users`;
    return this.http.post<User>(url, user);
  }

  /**
   * Actualiza los datos de un usuario
   * @param userId - ID del usuario
   * @param user - Datos del usuario a actualizar
   * @returns Observable<User>
   */
  updateUser(userId: number, user: User): Observable<User> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.put<User>(url, user);
  }

  /**
   * Elimina un usuario por su ID
   * @param userId - ID del usuario
   * @returns Observable<void>
   */
  deleteUser(userId: number): Observable<void> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.delete<void>(url);
  }
}


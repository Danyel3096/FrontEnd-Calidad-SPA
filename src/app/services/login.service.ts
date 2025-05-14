import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

export interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // Autenticación real usando API
  generateToken(loginData: { email: string; password: string }): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(environment.API_URL_USUARIO_LOGIN, loginData).pipe(
      catchError(error => {
        console.error('Error en la autenticación:', error);
        return throwError(error);
      })
    );
  }

  // Verificar si el usuario está logueado (si hay un token en localStorage)
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Logout: Limpiar el localStorage
  logout(): void {
    this.clearLocalStorage();
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Configurar el usuario en el localStorage
  setUser(user: any): void {
    if (user && user.sub && user.id && user.role && user.firstName && user.lastName) {
      const userData = {
        email: user.sub,  // Cambié `sub` por `email`
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userFirstName', user.firstName);
      localStorage.setItem('userLastName', user.lastName);
      localStorage.setItem('userRole', user.role);  // Guardar el rol del usuario
      localStorage.setItem('token', user.token);    // Aseguramos de guardar el token

    } else {
      console.error('No se puede guardar el usuario: la estructura del objeto es inválida');
    }
  }

  // Obtener el usuario desde localStorage
  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtener el rol directamente desde localStorage
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Método genérico para limpiar el localStorage
  private clearLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }
}

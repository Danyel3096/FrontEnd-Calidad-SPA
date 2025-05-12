import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // Simulación de login local (no se conecta con fakestore)
  generateToken(loginData: any) {
    // Simulación de usuarios con roles
    const validUsers: any = {
      admin: { password: '1234', role: 'ADMINISTRADOR' },
      cajero: { password: '1234', role: 'VENDEDOR_CAJERO' },
      cliente: { password: '1234', role: 'CLIENTE' },
      bodeguero: { password: '1234', role: 'BODEGUERO' }
    };

    const user = validUsers[loginData.username];

    if (user && user.password === loginData.password) {
      const fakeToken = 'fake-jwt-token';
      const fakeUser = {
        username: loginData.username,
        authorities: [{ authority: user.role }]
      };

      this.setUser(fakeUser);
      this.loginUser(fakeToken);
      return of({ token: fakeToken });
    } else {
      // Simula un error (rechazo de login)
      return of(null); // puedes usar `throwError` si prefieres
    }
  }

  loginUser(token: string) {
    localStorage.setItem('token', token);
    return true;
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserRole() {
    const user = this.getUser();
    return user?.authorities[0]?.authority || null;
  }

  getCurrentUser() {
    // Esta función ya no es necesaria si usas usuarios quemados
    return of(this.getUser());
  }
}

import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { jwtDecode } from "jwt-decode";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        // Validar expiración del token
        const currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos

        if (decoded.exp < currentTime) {
          console.warn('Token expirado, redirigiendo al login...');
          this.handleLogout();
          return throwError(() => new Error('Token expirado'));
        }

        // Actualizar datos del usuario en localStorage
        localStorage.setItem('userEmail', decoded.sub); // Email del usuario
        localStorage.setItem('userId', decoded.id.toString()); // ID del usuario
        localStorage.setItem('userExp', decoded.exp.toString()); // Expiración del token
        localStorage.setItem('userRole', decoded.role); // Rol del usuario
        localStorage.setItem('user', decoded.name); // Nombre del usuario

        // Clonar el request con el token en el header
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });

        return next.handle(authReq);

      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.handleLogout();
        return throwError(() => new Error('Token inválido'));
      }
    }

    return next.handle(req); // Si no hay token, se sigue con la petición normal
  }

  private handleLogout() {
    // Limpiar sesión
    this.loginService.logout();
    this.router.navigate(['/login']); // Redirigir al login
  }
}

export const authInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
];

import { Routes } from '@angular/router'; //OK

// Ruta por defecto
import { HomeComponent } from './pages/home/home.component';

// Rutas de la aplicación
import { SignupComponent } from './pages/signup/signup.component';
import {LoginComponent} from './pages/login/login.component';
import { UserRecoverPasswordComponent } from './pages/recover-password/user-recover-password.component';

// Rutas del dashboard de istrador
import { DashboardComponent } from './pages/dashboard/dashboard.component';

// Otras rutas
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { MissingComponent } from './pages/missing/missing.component';
import { HelpComponent } from './pages/help/help.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { CustomizationDashboardComponent } from './pages/dashboard/customization-dashboard/customization-dashboard.component';
import { StoresDashboardComponent } from './pages/dashboard/stores-dashboard/stores-dashboard.component';

// Arreglo con las rutas de la aplicación
export const routes: Routes = [
  // Por defecto
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', redirectTo: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent, pathMatch: 'full' },
  { path: 'contact', component: ContactComponent, pathMatch: 'full' },
  { path: 'dashboard', title: 'Dashboard component', component: DashboardComponent, 
    children: [
      {
        path: 'store', // child route path
        component: StoresDashboardComponent, // child route component that the router renders
      },
      {
        path: 'customization', // child route path
        component: CustomizationDashboardComponent, // child route component that the router renders
      }
    ]},
  // Paginas de la aplicacion
  { path: 'help', component: HelpComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'recover-password', component: UserRecoverPasswordComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () =>
      import('./pages/user/user.route'),
  },
  // Otras páginas
  { path: 'unauthorized', component: UnauthorizedComponent }, // ruta no autorizada
  { path: '**', component: MissingComponent }, // ruta no encontrada
];
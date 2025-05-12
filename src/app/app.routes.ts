import { Routes } from '@angular/router'; //OK

// Ruta por defecto
import { HomeComponent } from './pages/home/home.component';

// Rutas de la aplicación
import { SignupComponent } from './pages/signup/signup.component';
import {LoginComponent} from './pages/login/login.component';
import CartListComponent from './pages/cart/cart.component';
import { UserRecoverPasswordComponent } from './pages/recover-password/user-recover-password.component';

// Rutas protegidas
import { NormalGuard } from './services/normal.guard';
import { AdminGuard } from './services/admin.guard';

// Rutas del dashboard de istrador
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesDashboardComponent } from './pages/dashboard/categories-dashboard/categories-dashboard.component';
import { MetricsDashboardComponent } from './pages/dashboard/metrics-dashboard/metrics-dashboard.component';
import { OrdersDashboardComponent } from './pages/dashboard/orders-dashboard/orders-dashboard.component';
import { ProductsDashboardComponent } from './pages/dashboard/products-dashboard/products-dashboard.component';
import { RolesDashboardComponent } from './pages/dashboard/roles-dashboard/roles-dashboard.component';
import { UsersDashboardComponent } from './pages/dashboard/users-dashboard/users-dashboard.component';

// Otras rutas
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { MissingComponent } from './pages/missing/missing.component';
import { HelpComponent } from './pages/help/help.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { CustomizationDashboardComponent } from './pages/dashboard/customization-dashboard/customization-dashboard.component';
import { ShoppingDashboardComponent } from './pages/dashboard/shopping-dashboard/shopping-dashboard.component';

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
        path: 'categories', // child route path
        component: CategoriesDashboardComponent, // another child route component that the router renders
      },
      {
        path: 'metrics', // child route path
        component: MetricsDashboardComponent, // another child route component that the router renders
      },
      {
        path: 'products', // child route path
        component: ProductsDashboardComponent, // child route component that the router renders
      },
      {
        path: 'orders', // child route path
        component: OrdersDashboardComponent, // child route component that the router renders
      },
      {
        path: 'roles', // child route path
        component: RolesDashboardComponent, // child route component that the router renders
      },
      {
        path: 'shopping', // child route path
        component: ShoppingDashboardComponent, // child route component that the router renders
      },
      {
        path: 'users', // child route path
        component: UsersDashboardComponent, // child route component that the router renders
      },
      {
        path: 'customization', // child route path
        component: CustomizationDashboardComponent, // child route component that the router renders
      }
    ], canActivate: [AdminGuard] },
  // Paginas de la aplicacion
  { path: 'cart', component: CartListComponent, pathMatch: 'full' },
  { path: 'help', component: HelpComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () =>
      import('./pages/products/products-list.route'),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./pages/products/product-detail.route'),
  },
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

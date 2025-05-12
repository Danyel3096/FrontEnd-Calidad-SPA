import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./user-page/user-page.component').then(m => m.UserPageComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./user-settings/user-settings.component').then(m => m.UserSettingsComponent),
  },
  //{ path: "user/:userId", component: OtherComponent },
] as Routes;

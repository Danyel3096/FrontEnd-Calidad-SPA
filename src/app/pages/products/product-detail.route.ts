import { Routes } from '@angular/router';

export default [
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component'),
  },
] as Routes;

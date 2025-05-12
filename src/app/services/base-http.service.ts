import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class BaseHttpService {

  constructor() { }

  http = inject(HttpClient);
  apiUrlProducts = environment.API_URL_PRODUCTO_READALL;
}
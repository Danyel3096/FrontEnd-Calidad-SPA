/*
  * For easier debugging in development mode, you can import the following file
  * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
  *
  * This import should be commented out in production mode because it will have a negative impact
  * on performance if an error is thrown.
  *
*/
/*
NOTA: Este archivo es para el entorno de desarrollo. Si quieres cambiar la URL de la API, puedes hacerlo aquí.
Puedes cambiar la URL de la API en el archivo environment.ts para producción cuando tengamos los endpoints del backend.
*/

const API_URL_BASE = 'https://tdd-billing-backend.onrender.com/'; // URL actualizada

export const environment = {
  production: false,
  API_URL: API_URL_BASE,

  // Productos
  API_URL_PRODUCTO_CREATE: `${API_URL_BASE}/products`,
  API_URL_PRODUCTO_READALL: `${API_URL_BASE}/products`,
  API_URL_PRODUCTO_READBYID: `${API_URL_BASE}/products/`,
  API_URL_PRODUCTO_READBYCATEGORY: `${API_URL_BASE}/products/category/`,
  API_URL_PRODUCTO_UPDATE: `${API_URL_BASE}/products/`,
  API_URL_PRODUCTO_DELETELOGICALLY: `${API_URL_BASE}/products/`,

  // Categorías
  API_URL_CATEGORIA_CREATE: `${API_URL_BASE}/products/categories`,
  API_URL_CATEGORIA_READALL: `${API_URL_BASE}/products/categories`,
  API_URL_CATEGORIA_READBYID: `${API_URL_BASE}api/categories/store/2`,
  API_URL_CATEGORIA_UPDATE: `${API_URL_BASE}/products/categories/`,
  API_URL_CATEGORIA_DELETELOGICALLY: `${API_URL_BASE}/products/categories/`,

  // Login (autenticación)
  API_URL_USUARIO_LOGIN: `${API_URL_BASE}rest/auth/login`, // URL de login actualizada
  API_URL_USUARIO_REGISTRO: `${API_URL_BASE}users`

};



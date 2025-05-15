export interface Store {
  id?: number;
  userId?: number;
  name: string;
  url: string;
  email: string;
  contact: string;
  nit: string;
  logo: string;
  description: string;
  address: string;
  status: string;
  deleted?: string;
  createdAt?: string;
}
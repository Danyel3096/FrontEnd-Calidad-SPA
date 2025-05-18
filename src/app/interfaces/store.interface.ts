export interface Store {
  id: number;
  name: string;
  url: string;
  email: string;
  contact: string;
  nit: string;
  logo?: string;
  description: string;
  address: string;
  status?: boolean;
  createdAt?: string;
  image?: File;
}
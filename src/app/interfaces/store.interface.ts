export interface Store {
  id?: number;
  user_id?: number;
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
  created_at?: string;
}
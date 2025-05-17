export interface User {
    id?: number;
    email: string;
    password: string;
    role: string;
    photoUrl?: string;
    status?: boolean;
    createdAt?: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    address: string;
    storeId?: number;
  }
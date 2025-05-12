export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
}
  
  export interface ProductItemCart {
    product: Product;
    quantity: number;
  }

import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home Appliances',
  'Toys',
  'Sports Equipment'
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private storageKey = 'inventory_products';

  getProducts(): Product[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addProduct(product: Product) {
    const products = this.getProducts();
    products.push({ ...product, id: Date.now() });
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  deleteProduct(id: number) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  updateProduct(updatedProduct: any) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        products[index] = updatedProduct;
        localStorage.setItem('inventory_products', JSON.stringify(products));
      }
  }
}
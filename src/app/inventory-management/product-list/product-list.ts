import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product, CATEGORIES } from '../inventory-management';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: keyof Product = 'name';
  categories = CATEGORIES

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productService.getProducts();
  }

  get filteredProducts() {
    return this.products
      .filter(p => {
        const nameMatch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
        const categoryMatch = this.selectedCategory === '' || p.category === this.selectedCategory;
        return nameMatch && categoryMatch;
      })
      .sort((a, b) => {
        const valA = a[this.sortBy];
        const valB = b[this.sortBy];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.toLowerCase().localeCompare(valB.toLowerCase());
        }
        return (valA as number) - (valB as number);
      });
  }

  // --- EXCEL EXPORT ---
  exportToExcel() {
    const exportData = this.products.map(({ image, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, `Inventory_Export_${new Date().getTime()}.xlsx`);
  }

  // --- EXCEL IMPORT ---
  onImportExcel(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length > 0) {
        // bulk method to add product
        jsonData.forEach((prod: any) => {
          this.productService.addProduct({
            ...prod,
            price: Number(prod.price) || 0,
            stock: Number(prod.stock) || 0
          });
        });
        this.loadProducts();
        alert('Products imported successfully!');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  editProduct(id: number) {
    this.router.navigate(['/inventory-management/edit-product/', id]);
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
      this.loadProducts();
    }
  }

 get lowStockCount(): number {
  return this.products.filter(p => p.stock < 10).length;
 }

 filterLowStock() {
  this.searchTerm = '';
  this.selectedCategory = ''; 
  this.sortBy = 'stock'; 
}

}
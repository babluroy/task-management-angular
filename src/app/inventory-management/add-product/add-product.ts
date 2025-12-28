import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { CATEGORIES, ProductService } from '../inventory-management';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true, 
  templateUrl: './add-product.html',
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  imagePreview: string | null = null;
  categories = CATEGORIES;
  
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute, // Inject ActivatedRoute
    public router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProductData(this.productId);
    }
  }

  loadProductData(id: number) {
    const products = this.productService.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      this.productForm.patchValue(product);
      this.imagePreview = product.image || null;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.productForm.patchValue({ image: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.isEditMode) {
        // Update existing
        const updatedProduct = { ...this.productForm.value, id: this.productId };
        this.productService.updateProduct(updatedProduct);
      } else {
        // Add new
        this.productService.addProduct(this.productForm.value);
      }
      this.router.navigate(['/inventory-management/product-list']);
    }
  }
}
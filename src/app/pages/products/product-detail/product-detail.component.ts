import { Component, effect, inject, input } from '@angular/core';
import { ProductDetailStateService } from '../../../services/product-detail-state.service';
import { CurrencyPipe } from '@angular/common';
import { CartStateService } from '../../../services/cart-state.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  providers: [ProductDetailStateService],
})
export default class ProductDetailComponent {
  productDetailState = inject(ProductDetailStateService).state;
  cartState = inject(CartStateService).state;

  id = input.required<string>();

  constructor() {
    effect(() => {
      this.productDetailState.getById(this.id());
    });
  }

  addToCart() {
    this.cartState.add({
      product: this.productDetailState.product()!,
      quantity: 1,
    });
  }
}
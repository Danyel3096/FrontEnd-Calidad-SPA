import { TestBed } from '@angular/core/testing';

import { ProductDetailStateService } from './product-detail-state.service';

describe('ProductDetailStateService', () => {
  let service: ProductDetailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDetailStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

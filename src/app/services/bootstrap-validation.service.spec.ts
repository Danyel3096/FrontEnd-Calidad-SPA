import { TestBed } from '@angular/core/testing';

import { BootstrapValidationService } from './bootstrap-validation.service';

describe('BootstrapValidationService', () => {
  let service: BootstrapValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BootstrapValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

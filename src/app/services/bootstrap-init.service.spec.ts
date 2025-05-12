import { TestBed } from '@angular/core/testing';

import { BootstrapInitService } from './bootstrap-init.service';

describe('BootstrapInitService', () => {
  let service: BootstrapInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BootstrapInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

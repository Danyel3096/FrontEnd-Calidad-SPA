import { TestBed } from '@angular/core/testing';

import { DatatableLanguageService } from './datatable-language.service';

describe('DatatableLanguageService', () => {
  let service: DatatableLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatatableLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

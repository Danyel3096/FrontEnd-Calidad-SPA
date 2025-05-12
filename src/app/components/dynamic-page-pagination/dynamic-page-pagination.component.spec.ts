import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPagePaginationComponent } from './dynamic-page-pagination.component';

describe('DynamicPagePaginationComponent', () => {
  let component: DynamicPagePaginationComponent;
  let fixture: ComponentFixture<DynamicPagePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicPagePaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicPagePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

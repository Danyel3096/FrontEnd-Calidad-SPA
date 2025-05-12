import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPageButtonComponent } from './dynamic-page-button.component';

describe('DynamicPageButtonComponent', () => {
  let component: DynamicPageButtonComponent;
  let fixture: ComponentFixture<DynamicPageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicPageButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicPageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

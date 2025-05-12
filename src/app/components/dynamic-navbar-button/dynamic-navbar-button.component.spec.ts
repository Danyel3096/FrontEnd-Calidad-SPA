import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicButtonComponent } from './dynamic-navbar-button.component';

describe('DynamicButtonComponent', () => {
  let component: DynamicButtonComponent;
  let fixture: ComponentFixture<DynamicButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

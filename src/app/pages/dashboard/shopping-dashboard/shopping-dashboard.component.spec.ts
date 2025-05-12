import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingDashboardComponent } from './shopping-dashboard.component';

describe('ShoppingDashboardComponent', () => {
  let component: ShoppingDashboardComponent;
  let fixture: ComponentFixture<ShoppingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

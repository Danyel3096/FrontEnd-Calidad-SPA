import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationDashboardComponent } from './customization-dashboard.component';

describe('CustomizationDashboardComponent', () => {
  let component: CustomizationDashboardComponent;
  let fixture: ComponentFixture<CustomizationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizationDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPageTabsComponent } from './dynamic-page-tabs.component';

describe('DynamicPageTabsComponent', () => {
  let component: DynamicPageTabsComponent;
  let fixture: ComponentFixture<DynamicPageTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicPageTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicPageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

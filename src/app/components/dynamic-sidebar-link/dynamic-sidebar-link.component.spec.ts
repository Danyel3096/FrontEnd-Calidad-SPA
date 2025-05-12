import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSidebarLinkComponent } from './dynamic-sidebar-link.component';

describe('DynamicSidebarLinkComponent', () => {
  let component: DynamicSidebarLinkComponent;
  let fixture: ComponentFixture<DynamicSidebarLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicSidebarLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicSidebarLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

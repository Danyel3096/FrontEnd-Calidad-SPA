import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-page-tabs',
  imports: [CommonModule],
  templateUrl: './dynamic-page-tabs.component.html',
  styleUrl: './dynamic-page-tabs.component.css'
})

export class DynamicPageTabsComponent {
  @Input() tabs: string[] = [];
  @Input() selectedTabItem: string = '';
  @Input() color: any = {};

  @Output() tabChange = new EventEmitter<string>();

  hoveredTabItem: string | null = null;

  onTabClick(tab: string): void {
    this.tabChange.emit(tab);
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-page-pagination',
  imports: [CommonModule],
  templateUrl: './dynamic-page-pagination.component.html',
  styleUrl: './dynamic-page-pagination.component.css'
})

export class DynamicPagePaginationComponent {

  @Input() totalPages!: number;
  @Input() currentPage!: number;
  @Input() color!: {
    background: string;
    hoverBackground: string;
    text: string;
    hoverText: string
  };

  @Output() pageChange = new EventEmitter<number | 'next' | 'previous'>();

  hoveredPage: number | null = null;

  onClick(page: number | 'next' | 'previous') {
    this.pageChange.emit(page);
  }
}

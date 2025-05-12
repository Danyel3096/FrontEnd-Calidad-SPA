import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';

@Component({
  selector: 'app-about',
  imports: [CommonModule, DynamicCardComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}

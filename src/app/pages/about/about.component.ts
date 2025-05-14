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
  teamMembers = [
    {
      name: 'Fernando Martínez',
      role: 'Project Manager',
      image: 'assets/team/fernando.png'
    },
    {
      name: 'Lucía Gómez',
      role: 'Frontend Developer',
      image: 'assets/team/lucia.png'
    },
    {
      name: 'Diego Ruiz',
      role: 'Backend Developer',
      image: 'assets/team/diego.png'
    }
  ];

}

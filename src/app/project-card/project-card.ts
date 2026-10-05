import { Component, Input } from '@angular/core';

export interface Project {
  id: number;
  title: string;
  description: string;
  github: string;
  demo: string;
  demoText: string;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}

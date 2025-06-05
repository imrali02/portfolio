import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from './project-card/project-card';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
  demoText: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ProjectCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected projects: Project[] = [
    {
      id: 1,
      title: 'Rabbit Replay',
      description:
        'Python discord bot that uses custom web sockets to communicate on an MQTT server',
      image: '../assets/project1.jpg',
      github: 'https://github.com/imrali02/rabbit-replay',
      demo: 'https://project1-demo.com',
      demoText: 'Add it to your server!',
    },
    {
      id: 2,
      title: 'Puzzmino',
      description:
        '2D puzzle game implementing side scroller mechanics with tetromino block puzzles',
      image: '../assets/project2.jpg',
      github: 'https://github.com/imrali02/Puzzmino',
      demo: 'https://project2-demo.com',
      demoText: 'Play it on itch.io!',
    },
    {
      id: 3,
      title: 'HvZ Player Tracker',
      description:
        'ASP.NET MVC web implementation of player log for Humans vs. Zombies club event ',
      image: '../assets/project3.jpg',
      github: 'https://github.com/imrali02/hvz-player-tracker',
      demo: 'https://project3-demo.com',
      demoText: 'Take a look!',
    },
  ];
}

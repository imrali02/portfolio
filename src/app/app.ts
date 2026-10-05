import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactComponent } from './contact/contact';
import { Project, ProjectCardComponent } from './project-card/project-card';

const FOOTER_TEXT = '  made by @imrali02, based on design by @webdevharsha  ';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProjectCardComponent, ContactComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly year = new Date().getFullYear();

  protected readonly banner = [
    '██╗███╗   ███╗██████╗  █████╗ ███╗   ██╗   ██╗  ██╗ █████╗ ██╗██████╗ ███████╗██████╗ ██╗   ██╗',
    '██║████╗ ████║██╔══██╗██╔══██╗████╗  ██║   ██║  ██║██╔══██╗██║██╔══██╗██╔════╝██╔══██╗╚██╗ ██╔╝',
    '██║██╔████╔██║██████╔╝███████║██╔██╗ ██║   ███████║███████║██║██║  ██║█████╗  ██████╔╝ ╚████╔╝ ',
    '██║██║╚██╔╝██║██╔══██╗██╔══██║██║╚██╗██║   ██╔══██║██╔══██║██║██║  ██║██╔══╝  ██╔══██╗  ╚██╔╝  ',
    '██║██║ ╚═╝ ██║██║  ██║██║  ██║██║ ╚████║   ██║  ██║██║  ██║██║██████╔╝███████╗██║  ██║   ██║   ',
    '╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ',
  ].join('\n');

  protected readonly footerBox = [
    `╔${'═'.repeat(FOOTER_TEXT.length)}╗`,
    `║${FOOTER_TEXT}║`,
    `╚${'═'.repeat(FOOTER_TEXT.length)}╝`,
  ].join('\n');

  protected readonly projects: Project[] = [
    {
      id: 1,
      title: 'Rabbit Replay',
      description:
        'Python discord bot that uses custom web sockets to communicate on an MQTT server',
      github: 'https://github.com/imrali02/rabbit-replay',
      demo: 'https://project1-demo.com',
      demoText: 'Add it to your server!',
    },
    {
      id: 2,
      title: 'Puzzmino',
      description:
        '2D puzzle game implementing side scroller mechanics with tetromino block puzzles',
      github: 'https://github.com/imrali02/Puzzmino',
      demo: 'https://project2-demo.com',
      demoText: 'Play it on itch.io!',
    },
    {
      id: 3,
      title: 'HvZ Player Tracker',
      description:
        'ASP.NET MVC web implementation of player log for Humans vs. Zombies club event ',
      github: 'https://github.com/imrali02/hvz-player-tracker',
      demo: 'https://project3-demo.com',
      demoText: 'Take a look!',
    },
  ];
}

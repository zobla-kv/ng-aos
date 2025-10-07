import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgAosDirective } from 'ng-aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgAosDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ssr-app');

  handleIntersection(ev: any) {
    console.log('intersected ev: ', ev);
  }
}

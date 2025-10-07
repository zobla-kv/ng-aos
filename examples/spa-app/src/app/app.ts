import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgAosDirective } from 'ng-aos';

console.log('NgAosDirective: ', NgAosDirective);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgAosDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('spa-app');

  handleIntersection(ev: any) {
    console.log('intersected ev: ', ev);
  }
}

import { Component, ElementRef, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgAos } from 'ng-aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgAos],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ssr-app');

  handleIntersection(ev: ElementRef) {
    console.log('intersected ev: ', ev);
  }
}

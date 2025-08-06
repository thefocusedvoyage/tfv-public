import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './shared/loader/loader'; // Adjust the import path as necessary
import { SharedModule } from './shared/shared';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Loader,
    SharedModule

  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tfv-public');
  public animationDone = false;

  setAnimationDone() {
    this.animationDone = true;
  }
}

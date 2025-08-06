import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './shared/loader/loader'; 
import { SharedModule } from './shared/shared';
import { ThemeService } from './services/theme.service'; 

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
export class App implements OnInit {

  constructor(private themeService: ThemeService) {

  }

  ngOnInit() {
    this.themeService.loadTheme(); // Set default theme
  }
  
  public animationDone = false;

  setAnimationDone() {
    this.animationDone = true;
  }

  public toggleTheme() {
    this.themeService.toggleTheme();
  }
}

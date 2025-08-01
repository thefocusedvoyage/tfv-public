import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {NgxTypedJsModule} from 'ngx-typed-js';

@Component({
  selector: 'app-home',
  imports: [NgxTypedJsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {

public typedStrings = [
    'Where every frame tells a story.',
    'Wildlife, travel, and aerial photography expertly crafted.',
    `The best part? It’s just a click away ↓`
  ];

}

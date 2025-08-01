import { Component } from '@angular/core';
import {NgxTypedJsModule} from 'ngx-typed-js';

@Component({
  selector: 'app-home',
  imports: [NgxTypedJsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {

public typedStrings = [
    'Where every frame tells a story.',
   'Memories fade, Photos don’t! Let me help you keep them alive.',
   'The best part? It’s just a click away ↓'
  ];

}

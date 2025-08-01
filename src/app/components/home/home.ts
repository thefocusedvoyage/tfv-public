import { Component, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import {NgxTypedJsModule} from 'ngx-typed-js';

@Component({
  selector: 'app-home',
  imports: [
    NgxTypedJsModule,
    NgbCarouselModule,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {

public typedStrings = [
    'Where every frame tells a story.',
    'Wildlife, travel, and aerial photography expertly crafted.',
    `The best part? It’s just a click away ↓`
  ];

  images = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png'];


	@ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

}

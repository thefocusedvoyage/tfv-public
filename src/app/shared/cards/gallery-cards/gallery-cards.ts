import { Component, Input, AfterViewInit } from '@angular/core';
import { gsap, ScrollSmoother } from '../../../../vendor/gsap/gsap';


@Component({
  selector: 'app-gallery-cards',
  imports: [],
  templateUrl: './gallery-cards.html',
  styleUrl: './gallery-cards.scss'
})
export class GalleryCards implements AfterViewInit {
  
  @Input() card: any = { title: '', description: '', image: '', dataTarget: 1, lastCategory: false };

  ngAfterViewInit(): void {
    
  }
}

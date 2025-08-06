import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import {gsap, ScrollTrigger} from '../../../vendor/gsap/gsap';


@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    const section = this.el.nativeElement.querySelector('#about');

    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(section, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        });

        gsap.from(section.querySelector('h2'), {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power2.out'
        });

        gsap.from(section.querySelector('.about-text'), {
          y: 60,
          opacity: 0,
          duration: 1.2,
          delay: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }
}
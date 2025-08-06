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
      start: 'top 85%',
      once: true,
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

        const svgPaths = section.querySelectorAll('.about-svg-bg path');
        svgPaths.forEach((path: SVGPathElement, i: number) => {
          const length = path.getTotalLength();
          gsap.fromTo(path,
            {
              strokeDasharray: length,
              strokeDashoffset: length
            },
            {
              strokeDashoffset: 0,
              duration: 5,
              ease: 'power2.out',
              delay: i * 0.2
            }
          );
        });
      }
    });
    
  }
}

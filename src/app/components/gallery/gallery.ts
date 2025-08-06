import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { gsap } from '../../../vendor/gsap/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SharedModule } from '../../shared/shared';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-gallery',
  imports: [SharedModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements AfterViewInit {
  private el = inject(ElementRef);
  galleryPhotos = [
    { src: 'images/01.png', alt: 'Gallery Photo 1' },
    { src: 'images/02.png', alt: 'Gallery Photo 2' },
    { src: 'images/03.png', alt: 'Gallery Photo 3' },
    { src: 'images/04.png', alt: 'Gallery Photo 4' },
    { src: 'images/05.png', alt: 'Gallery Photo 5' },
    { src: 'images/06.png', alt: 'Gallery Photo 6' },
    { src: 'images/07.png', alt: 'Gallery Photo 7' },
    { src: 'images/08.png', alt: 'Gallery Photo 8' },
    { src: 'images/09.png', alt: 'Gallery Photo 9' }
   
  ];
  ngAfterViewInit() {
    const section = this.el.nativeElement.querySelector('.gallery-section');
    const wrapper = section.querySelector('.gallery-wrapper');
    const totalScroll = wrapper.scrollWidth - window.innerWidth;

    gsap.to(wrapper, {
      x: () => `-${totalScroll}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: true,
        anticipatePin: 1
      }
    });

  }

}

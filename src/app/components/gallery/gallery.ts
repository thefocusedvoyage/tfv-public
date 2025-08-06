import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { gsap ,ScrollTrigger} from '../../../vendor/gsap/gsap';
import { SharedModule } from '../../shared/shared';

@Component({
  selector: 'app-gallery',
  imports: [SharedModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements AfterViewInit {
  private el = inject(ElementRef);
  categories = ['Wildlife', 'Landscape', 'Urban'];

  galleryPhotosByCategory: Record<string, { src: string, alt: string }[]> = {
    Wildlife: [
      { src: 'images/01.png', alt: 'Wildlife Photo 1' },
      { src: 'images/02.png', alt: 'Wildlife Photo 2' },
      { src: 'images/03.png', alt: 'Wildlife Photo 3' }
    ],
    Landscape: [
      { src: 'images/04.png', alt: 'Landscape Photo 1' },
      { src: 'images/05.png', alt: 'Landscape Photo 2' },
      { src: 'images/06.png', alt: 'Landscape Photo 3' }
    ],
    Urban: [
      { src: 'images/07.png', alt: 'Urban Photo 1' },
      { src: 'images/08.png', alt: 'Urban Photo 2' },
      { src: 'images/09.png', alt: 'Urban Photo 3' }
    ]
  };

  activeCategory = 'Wildlife';
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

  switchCategory(category: string): void {
    if (category === this.activeCategory) return;

    const currentGrid = this.el.nativeElement.querySelector(`[data-category="${this.activeCategory}"]`);
    const newGrid = this.el.nativeElement.querySelector(`[data-category="${category}"]`);

    gsap.to(currentGrid, {
      x: '-100%',
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    });

    gsap.fromTo(newGrid,
      { x: '100%', opacity: 0 },
      {
        x: '0%',
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut',
        onStart: ():any => this.activeCategory = category
      }
    );
  }

}

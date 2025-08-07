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
  ngAfterViewInit(): void {
    const gallerySection = this.el.nativeElement.querySelector('#gallery');
    const track = this.el.nativeElement.querySelector('.gallery-track');
    const cards = this.el.nativeElement.querySelectorAll('.gallery-card');
    const totalCards = cards.length;

    // Set track width based on card count
    (track as HTMLElement).style.width = `${100 * totalCards}vw`;

    // Calculate scroll distance as total width minus viewport width
    const scrollDistance = (track.scrollWidth - gallerySection.clientWidth);

    gsap.to(track, {
      x: () => `-${scrollDistance}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: gallerySection,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => scrollDistance,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true
      }
    });

    // Animate SVG lines
    const svgPaths = this.el.nativeElement.querySelectorAll('.gallery-svg-bg path');
    svgPaths.forEach((path: SVGPathElement) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gallerySection,
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      });
    });

    // Animate Lens Iris Rotation & Pulse
    const irisBlades = this.el.nativeElement.querySelectorAll('#lens-iris path');
    if (irisBlades.length) {
      gsap.fromTo(irisBlades,
        {
          scale: 0.8,
          rotation: 0,
          transformOrigin: '50% 50%'
        },
        {
          scale: 1.1,
          rotation: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: gallerySection,
            start: 'top center',
            end: 'bottom center',
            scrub: true
          }
        }
      );
    }

    // Animate Polaroid Film Ripple
    const rippleSVG = this.el.nativeElement.querySelectorAll('.gallery-svg-bg circle');
    if (rippleSVG.length) {
      gsap.fromTo(rippleSVG,
        {
          scale: 0.7,
          opacity: 0.1,
          transformOrigin: 'center'
        },
        {
          scale: 1.2,
          opacity: 0.3,
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: 'sine.inOut'
        }
      );
    }

    // Animate Glowing Grid Warp
    const gridPaths = this.el.nativeElement.querySelectorAll('#glowing-grid path');
    if (gridPaths.length) {
      gridPaths.forEach((path: SVGPathElement, index: number) => {
        gsap.fromTo(path,
          { strokeOpacity: 0, y: -5 },
          {
            strokeOpacity: 0.05,
            y: 5,
            ease: 'sine.inOut',
            duration: 2,
            repeat: -1,
            yoyo: true,
            delay: index * 0.1
          }
        );
      });
    }

    // Animate Paper Cut Style Mountain Layers
    const mountainLayers = this.el.nativeElement.querySelectorAll('.gallery-svg-bg .mountain-layer');
    if (mountainLayers.length) {
      mountainLayers.forEach((layer: SVGPathElement, index: number) => {
        gsap.fromTo(layer,
          { y: 10 * (mountainLayers.length - index) },
          {
            y: -20 * index,
            ease: 'none',
            scrollTrigger: {
              trigger: gallerySection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      });
    }

    // Animate Constellation Web
    const constellationStars = this.el.nativeElement.querySelectorAll('#constellation-web circle');
    const constellationLines = this.el.nativeElement.querySelectorAll('#constellation-web line');

    // Animate stars: twinkling randomly
    constellationStars.forEach((star: SVGCircleElement) => {
      const randomDelay = Math.random() * 2;
      const randomDuration = 1 + Math.random() * 2;
      gsap.fromTo(star,
        { opacity: 0.1 },
        {
          opacity: 0.4,
          repeat: -1,
          yoyo: true,
          duration: randomDuration,
          delay: randomDelay,
          ease: 'sine.inOut'
        }
      );
    });

    // Animate lines: soft flicker glow
    constellationLines.forEach((line: SVGLineElement) => {
      const randomDelay = Math.random() * 2;
      const randomDuration = 1.5 + Math.random();
      gsap.fromTo(line,
        { strokeOpacity: 0 },
        {
          strokeOpacity: 0.06,
          repeat: -1,
          yoyo: true,
          duration: randomDuration,
          delay: randomDelay,
          ease: 'sine.inOut'
        }
      );
    });
  }
}

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

    // Pin the About section at the center of the viewport for a moment
    ScrollTrigger.create({
      trigger: section,
      start: 'center center',
      end: '+=100%', // keep pinned for one viewport-height worth of scroll
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    });

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

        gsap.from(section.querySelector('.scroll-down-about'), {
          y: 60,
          opacity: 0,
          duration: 1.2,
          delay: 0.3,
          ease: 'power2.out'
        });


        // Photography-inspired founder image reveal with scale-up and flash-style brightness pulse
        const founderImage = section.querySelector('.founder-img');
        gsap.fromTo(founderImage,
          {
            opacity: 0,
            y: 60,
            scale: 0.6,
            filter: 'brightness(0.5)'
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'brightness(1)',
            duration: 1.5,
            ease: 'power4.out'
          }
        );
      }
    });

    const exitTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    exitTimeline.to(section.querySelector('h2'), {
      y: 40,
      opacity: 0,
      ease: 'power2.out'
    }, 0);

    exitTimeline.to(section.querySelector('.about-text'), {
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    }, 0);

    exitTimeline.to(section.querySelector('.scroll-down-about'), {
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    }, 0);

    exitTimeline.to(section.querySelector('.founder-img'), {
      y: -30,
      scale: 0.9,
      opacity: 0,
      ease: 'power2.out'
    }, 0);

    
    
  }

  scrollToGallery(): void {
    const gallerySection = document.querySelector('#gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

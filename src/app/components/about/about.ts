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

    // Scroll-scrubbed, pinned timeline to align speed with background
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        id: 'about-tl',
        trigger: section,
        start: 'top 65%',
        end: '+=120%', // increase distance for a slower, parallax-like feel
        pin: true,
        pinSpacing: true,
        scrub: 3, // match background timelines' scrub for consistent speed
        anticipatePin: 1,
        invalidateOnRefresh: true
        // markers: true,
      }
    });

    // Ensure section becomes visible when the timeline begins
    aboutTl.set(section, { opacity: 1 }, 0);

    // Headline
    aboutTl.from(section.querySelector('h2'), {
      y: 80,
      opacity: 0,
      ease: 'none'
    }, 0);

    // Body copy
    aboutTl.from(section.querySelector('.about-text'), {
      y: 100,
      opacity: 0,
      ease: 'none'
    }, 0.1);

    // Scroll cue
    aboutTl.from(section.querySelector('.scroll-down-about'), {
      y: 100,
      opacity: 0,
      ease: 'none'
    }, 0.15);

    // Founder image
    aboutTl.from(section.querySelector('.founder-img'), {
      y: 120,
      scale: 0.92,
      opacity: 0,
      filter: 'brightness(0.85)',
      ease: 'none'
    }, 0);
  }

  scrollToGallery(): void {
    const gallerySection = document.querySelector('#gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

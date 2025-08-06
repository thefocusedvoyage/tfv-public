import { Component, AfterViewInit } from '@angular/core';
import {gsap} from '../../../vendor/gsap/gsap';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements AfterViewInit {
  ngAfterViewInit(): void {
        gsap.fromTo('.logo-text', 
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        duration: 20,
        ease: 'power2.out'
      }
    );

    gsap.fromTo('.scroll-down', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, delay: 2, duration: 1, ease: 'power2.out' }
    );

    gsap.utils.toArray<SVGPathElement>('.svg-bg path').forEach((path, i) => {
      const length = path.getTotalLength();
      gsap.fromTo(path, 
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 2 + i, ease: 'power2.inOut', repeat: -1, yoyo: true, delay: i * 0.5 }
      );
    });
  
    gsap.from('.tag-word', {
      y: 20,
      opacity: 0,
      duration: 2,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 1
    });

     gsap.fromTo('.scroll-icon', 
      { y: 0 }, 
      { y: 10, duration: 0.8, repeat: -1, yoyo: true, ease: 'power1.inOut' }
    );

    const focusBlurTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Foreground blur: tagline and logo
    focusBlurTimeline.to('.logo-text', {
      filter: 'blur(5px)',
      scale: 1.05,
      opacity: 0.3,
      ease: 'power2.out'
    }, 0);

    focusBlurTimeline.to('.tag-word', {
      filter: 'blur(6px)',
      opacity: 0.2,
      ease: 'power2.out',
      stagger: 0.05
    }, 0);

    // Background SVG lines become sharper and slightly shift
    focusBlurTimeline.to('.svg-bg path', {
      opacity: 0.3,
      scale: 1.02,
      ease: 'power2.out',
      stagger: 0.1
    }, 0);
  
      
  }

  scrollToAbout(): void {
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
}

}
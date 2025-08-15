import { Component, AfterViewInit } from '@angular/core';
import {gsap} from '../../../vendor/gsap/gsap';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class Hero implements AfterViewInit {
  ngAfterViewInit(): void {
        gsap.fromTo('.logo-text', 
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        duration: 15,
        ease: 'power2.out'
      }
    );

    gsap.fromTo('.scroll-down', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, delay: 1.5, duration: 1, ease: 'power2.out' }
    );

  
    gsap.from('.tag-word', {
      y: 20,
      opacity: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.8
    });

     gsap.fromTo('.scroll-icon', 
      { y: 0 }, 
      { y: 10, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' }
    );

    // Aperture blades slow rotation animation
    gsap.to('#wireframe-lens', {
      rotation: 360,
      transformOrigin: '50% 50%',
      duration: 25,
      ease: 'none',
      repeat: -1
    });

    // Subtle open/close scaling to mimic aperture adjusting
    gsap.to('#wireframe-lens', {
      scale: 1.1,
      transformOrigin: '50% 50%',
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Animate concentric circles (lens effect)
    gsap.utils.toArray<SVGCircleElement>('.lens-circle').forEach((circle, i) => {
      const length = circle.getTotalLength();
      gsap.fromTo(circle,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 2.5,
          delay: i * 0.3,
          ease: 'power2.inOut'
        }
      );
    });

    // Animate floating particles
    gsap.utils.toArray<SVGCircleElement>('#floating-particles circle').forEach((particle, i) => {
      gsap.to(particle, {
        x: 'random(-5,5)',
        y: 'random(-5,5)',
        duration: 4 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.1
      });
    });

    // Animate Soft Lens Glow
    const lensGlow = document.querySelector<SVGElement>('#lens-glow');
    if (lensGlow) {
      gsap.to(lensGlow, {
        scale: 1.05,
        opacity: 0.03,
        transformOrigin: '50% 50%',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Exit animation for background on scroll out
    gsap.to('.svg-bg', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true
      },
      opacity: 0,
      scale: 0.9,
      ease: 'power1.out'
    });

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
      filter: 'blur(4px)',
      scale: 1.1,
      opacity: 0.25,
      ease: 'power2.out'
    }, 0);

    focusBlurTimeline.to('.tag-word', {
      filter: 'blur(5px)',
      opacity: 0.15,
      ease: 'power2.out',
      stagger: 0.04
    }, 0);

    // Background SVG lines become sharper and slightly shift
    focusBlurTimeline.to('.svg-bg', {
      opacity: 0.35,
      scale: 1.03,
      ease: 'power2.out'
    }, 0);
  
      
  }

  scrollToAbout(): void {
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
}

}
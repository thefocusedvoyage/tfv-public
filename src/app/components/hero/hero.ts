import { Component, AfterViewInit } from '@angular/core';
import {gsap} from '../../../vendor/gsap/gsap';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class Hero implements AfterViewInit {
  ngAfterViewInit(): void {

  
    gsap.from('.tag-word', {
      y: 20,
      opacity: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.8
    });

    gsap.fromTo('.scroll-down', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, delay: 1.5, duration: 1, ease: 'power2.out' }
    );

     gsap.fromTo('.scroll-icon', 
      { y: 0 }, 
      { y: 10, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' }
    );


    const focusBlurTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    

    

    

    
    this.parallaxAnimation();
      
  }

  parallaxAnimation() {

    // Parallax animation for Logo Text
      gsap.to('#tagline', {
        y: window.innerHeight*2, // adjust value based on mountain height
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        },
        ease: 'power1.out'
      });
  }

  scrollToAbout(): void {
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
}

}
import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { gsap ,ScrollTrigger} from '../../../vendor/gsap/gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SharedModule } from '../../shared/shared';
import { GalleryCards } from "../../shared/cards/gallery-cards/gallery-cards";

@Component({
  selector: 'app-gallery',
  imports: [SharedModule, GalleryCards],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements AfterViewInit {
  private el = inject(ElementRef);
  categories = [{
    title: 'Wildlife',
    description: 'Explore the beauty of wildlife through stunning photography.',
    image: 'images/wildlife.jpg',
    dataTarget: 1
  }, {
    title: 'Travel',
    description: 'Capture the essence of nature with breathtaking landscapes.',
    image: 'images/landscape.jpg',
    dataTarget: 2
  }, {
    title: 'Aerial',
    description: 'Discover the charm of urban life through captivating images.',
    image: 'images/urban.jpg',
    dataTarget: 3
  }]

  activeCategory = 'Wildlife';
  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
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
        scrub: 1.5, // slowed down scrub for smoother feel
        snap: 1 / (totalCards - 1), // snap to each card
        start: 'top top',
        end: () => `+=${gallerySection.clientWidth * totalCards}`, // one full viewport per card
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true
      }
    });



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


    // Handle scroll arrow clicks
    const arrows = this.el.nativeElement.querySelectorAll('.gallery-scroll-arrow');
    arrows.forEach((arrow: HTMLElement) => {
      arrow.addEventListener('click', () => {
        const target = arrow.getAttribute('data-target');
        if (!target) return;
        if (target.toLowerCase() === 'contact') {
          const contactSection = document.querySelector('#contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          const targetIndex = parseInt(target, 10);
          if (!isNaN(targetIndex) && targetIndex < totalCards) {
            const cardWidth = gallerySection.clientWidth;
            gsap.to(track, {
              x: `-${cardWidth * targetIndex}px`,
              duration: 1,
              ease: 'power2.inOut'
            });
            this.activeCategory = this.categories[targetIndex].title;
          }
        }
      });
    });

    // Animate last card's down arrow like Hero/About sections
    const downArrow = this.el.nativeElement.querySelector('.gallery-scroll-arrow[data-target="contact"] .animated-arrow');
    if (downArrow) {
      gsap.to(downArrow, {
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 0.8
      });
    }
  }
}

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
    image: 'images/01.png',
    dataTarget: 1,
    lastCategory: false
  }, {
    title: 'Travel',
    description: 'Capture the essence of nature with breathtaking landscapes.',
    image: 'images/01.png',
    dataTarget: 2,
    lastCategory: false
  }, {
    title: 'Aerial',
    description: 'Discover the charm of urban life through captivating images.',
    image: 'images/01.png',
    dataTarget: 'contact',
    lastCategory: true
  }]

  activeCategory = 'Wildlife';
  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
    const gallerySection = this.el.nativeElement.querySelector('#gallery') as HTMLElement;
    const track = this.el.nativeElement.querySelector('.gallery-track') as HTMLElement;
    const cards = Array.from(this.el.nativeElement.querySelectorAll('.gallery-card')) as HTMLElement[];
    const totalCards = cards.length;

    // Set track width based on card count
    track.style.width = `${100 * totalCards}vw`;

    const panelWidth = () => gallerySection.clientWidth;

    // Build a master timeline that gates each subsection:
    // For each card: 1) vertical parallax of 4 photos, then 2) horizontal slide to next card (except last).
    const stages = totalCards * 2 - 1; // vertical + horizontal per card except last horizontal
    const tl = gsap.timeline({ defaults: { ease: 'none' } });

    // Ensure all gallery photos have baseline positions
    cards.forEach((panel) => {
      const photos = Array.from(panel.querySelectorAll<HTMLElement>('.gallery-photo'));
      photos.forEach((photo, idx) => {
        gsap.set(photo, { yPercent: 40 + idx * 15, opacity: 0 });
      });
    });

    cards.forEach((panel, i) => {
      const photos = Array.from(panel.querySelectorAll<HTMLElement>('.gallery-photo'));
      // Vertical stage: animate 4 photos upward with slight offsets and fade in
      tl.to(photos, {
        yPercent: (index: number) => -40 + index * -10,
        opacity: (index: number) => 1 - index * 0.05,
        duration: 1
      });

      // Exit animation for current grid before transitioning to next subsection
      if (i < totalCards - 1) {
        tl.to(photos, {
          opacity: 0,
          yPercent: "+=10",
          duration: 0.4
        }, ">-0.1"); // slight overlap for smoothness
      }

      // Horizontal stage: move to next panel (skip for last card)
      if (i < totalCards - 1) {
        tl.to(track, {
          x: () => `-${panelWidth() * (i + 1)}px`,
          duration: 1
        });
      }
    });

    // Pin and scrub the master timeline; snap to each stage boundary
    ScrollTrigger.create({
      animation: tl,
      trigger: gallerySection,
      pin: true,
      scrub: 1.2,
      snap: gsap.utils.snap(1 / (stages - 1)),
      start: 'top top',
      end: () => "+=" + (stages * panelWidth() * 0.6), // proportional to viewport width
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => this.updateCategoryBackground(self.progress)
    });



    // Initialize category background animations
    this.initializeCategoryBackgrounds();
    
    // Refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();


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
            
            // Update active category and trigger background animation
            const newCategory = this.categories[targetIndex].title;
            if (newCategory !== this.activeCategory) {
              this.transitionCategoryBackground(this.activeCategory, newCategory);
              this.activeCategory = newCategory;
            }
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

  private initializeCategoryBackgrounds(): void {
    // Set initial state - show Wildlife background
    const wildlifeSvg = this.el.nativeElement.querySelector('.wildlife-svg');
    if (wildlifeSvg) {
      wildlifeSvg.classList.add('active');
      this.animateSvgPaths(wildlifeSvg);
    }

    // Initialize all SVG paths with stroke-dasharray
    const allSvgPaths = this.el.nativeElement.querySelectorAll('.svg-path');
    allSvgPaths.forEach((path: Element) => {
      const svgPath = path as SVGPathElement;
      const length = svgPath.getTotalLength();
      gsap.set(svgPath, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
    });
  }

  private updateCategoryBackground(progress: number): void {
    const totalCards = this.categories.length;
    const cardIndex = Math.round(progress * (totalCards - 1));
    const newCategory = this.categories[cardIndex].title;
    
    if (newCategory !== this.activeCategory) {
      this.transitionCategoryBackground(this.activeCategory, newCategory);
      this.activeCategory = newCategory;
    }
  }

  private transitionCategoryBackground(fromCategory: string, toCategory: string): void {
    const fromSvg = this.el.nativeElement.querySelector(`.${fromCategory.toLowerCase()}-svg`);
    const toSvg = this.el.nativeElement.querySelector(`.${toCategory.toLowerCase()}-svg`);
    
    if (fromSvg && toSvg) {
      // Exit animation for current category
      gsap.to(fromSvg, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          fromSvg.classList.remove('active');
        }
      });

      // Exit animation for SVG paths
      const fromPaths = fromSvg.querySelectorAll('.svg-path');
      fromPaths.forEach((path: Element, i: number) => {
        const svgPath = path as SVGPathElement;
        const length = svgPath.getTotalLength();
        gsap.to(svgPath, {
          strokeDashoffset: length,
          duration: 0.3,
          ease: 'power2.inOut',
          delay: i * 0.05
        });
      });

      // Enter animation for new category
      toSvg.classList.add('active');
      gsap.to(toSvg, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      });

      // Enter animation for SVG paths
      this.animateSvgPaths(toSvg);
    }
  }

  private animateSvgPaths(svgElement: Element): void {
    const paths = svgElement.querySelectorAll('.svg-path');
    paths.forEach((path: Element, i: number) => {
      const svgPath = path as SVGPathElement;
      const length = svgPath.getTotalLength();
      gsap.to(svgPath, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.1
      });
    });
  }


}

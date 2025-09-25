import { Component, AfterViewInit, ElementRef, inject, OnDestroy } from '@angular/core';
import { gsap ,ScrollTrigger} from '../../../vendor/gsap/gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SharedModule } from '../../shared/shared';
import { GalleryCards } from "../../shared/cards/gallery-cards/gallery-cards";

interface GalleryCategory {
  title: string;
  description: string;
  images: string[];
  image?: string;
  dataTarget: number | string;
  lastCategory: boolean;
  details?: Array<{ label: string; value: string }>;
}

@Component({
  selector: 'app-gallery',
  imports: [SharedModule, GalleryCards],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  categories: GalleryCategory[] = [{
    title: 'WILDLIFE',
    description: 'Explore the beauty of wildlife through stunning photography.',
    images: [
      'images/wildlife/01.jpg',
      'images/wildlife/02.jpg',
      'images/wildlife/03.png', 
      'images/wildlife/04.png',
      'images/wildlife/05.png',
      'images/wildlife/06.png',
      'images/wildlife/07.png',
      'images/wildlife/08.png', 
      'images/wildlife/09.png',
      'images/wildlife/10.png',
      'images/wildlife/11.jpg',
      'images/wildlife/12.jpg',
      'images/wildlife/13.jpg',
      'images/wildlife/14.jpg',
      'images/wildlife/15.jpg',
      'images/wildlife/17.jpg',
      'images/wildlife/18.jpg',
      'images/wildlife/19.jpg',
      'images/wildlife/20.jpg',
      'images/wildlife/21.jpg',
      'images/wildlife/22.jpg',
      'images/wildlife/23.jpg'
    ],
    dataTarget: 1,
    lastCategory: false
  }, {
    title: 'TRAVEL',
    description: 'Capture the essence of nature with breathtaking landscapes.',
    images: [
      'images/travel/01.jpg',
      'images/travel/02.JPG',
      'images/travel/03.JPG', 
      'images/travel/04.JPG',
      'images/travel/05.JPG',
      'images/travel/06.JPG',
      'images/travel/07.JPG',
      'images/travel/08.jpg', 
      'images/travel/09.jpg',
      'images/travel/12.JPG',
      'images/travel/13.JPG'],
    dataTarget: 2,
    lastCategory: false
  }, {
    title: 'AERIAL',
    description: 'Discover the charm of urban life through captivating images.',
    images: [
      'images/aerial/01.jpg',
      'images/aerial/02.jpg',
      'images/aerial/03.jpg', 
      'images/aerial/04.jpg',
      'images/aerial/05.jpg',
      'images/aerial/06.jpg',
      'images/aerial/07.jpg',
      'images/aerial/08.jpg', 
      'images/aerial/09.jpg',
      'images/aerial/10.jpg',
      'images/aerial/11.jpg'
    ],
    dataTarget: 'contact',
    lastCategory: true
  }]

  activeCategory = 'Wildlife';
  isModalOpen = false;
  selectedCategory: GalleryCategory | null = null;
  private modalParallaxCleanups: Array<() => void> = [];

  openGalleryModal(category: GalleryCategory): void {
    const images = category.images?.length ? category.images : (category.image ? [category.image] : []);
    this.selectedCategory = { ...category, images };
    this.isModalOpen = true;
    this.toggleBodyScroll(true);
    setTimeout(() => {
      const host = this.el.nativeElement as HTMLElement;
      const modal = host.querySelector('.gallery-modal') as HTMLElement | null;
      modal?.focus();
      this.setupModalParallax();
    }, 0);
  }

  closeGalleryModal(): void {
    this.teardownModalParallax();
    this.isModalOpen = false;
    this.selectedCategory = null;
    this.toggleBodyScroll(false);
  }

  handleModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeGalleryModal();
    }
  }

  ngOnDestroy(): void {
    this.toggleBodyScroll(false);
    this.teardownModalParallax();
  }

  private toggleBodyScroll(lock: boolean): void {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (!body) return;
    if (lock) {
      body.classList.add('tfv-modal-open');
    } else {
      body.classList.remove('tfv-modal-open');
    }
  }

  private setupModalParallax(): void {
    const host = this.el.nativeElement as HTMLElement;
    const scroller = host.querySelector<HTMLElement>('.gallery-modal-body');
    const items = Array.from(host.querySelectorAll<HTMLElement>('.gallery-modal-item'));
    if (!items.length || !scroller) return;

    this.teardownModalParallax();

    const clamp = gsap.utils.clamp(-1, 1);
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

    const touchConfig = {
      intensity: reduceMotion ? 0.12 : 0.45,
      rotX: -18,
      rotY: 14,
      liftY: -26,
      depth: 55,
      scaleBase: 0.12,
      scaleExtra: 0.08,
      brightBase: 0.16,
      brightExtra: 0.1,
      contrast: 0.1,
      saturation: 0.06,
      shadowBase: 0.24,
      shadowExtra: 0.16,
      shadowLift: 12,
      shadowBlur: 26
    } as const;

    const desktopConfig = {
      intensity: reduceMotion ? 0.12 : 0.6,
      rotX: -14,
      rotY: 10,
      liftY: -20,
      depth: 45,
      scaleBase: 0.1,
      scaleExtra: 0.05,
      brightBase: 0.12,
      brightExtra: 0.06,
      contrast: 0.08,
      saturation: 0.04,
      shadowBase: 0.18,
      shadowExtra: 0.12,
      shadowLift: 9,
      shadowBlur: 22
    } as const;

    const cfg = isTouch ? touchConfig : desktopConfig;

    const transforms = items.map((item) => {
      const image = item.querySelector<HTMLImageElement>('.gallery-modal-image');
      if (!image) return null;
      gsap.set(item, { transformPerspective: 800, transformStyle: 'preserve-3d' });
      return { item, image };
    }).filter(Boolean) as Array<{ item: HTMLElement; image: HTMLImageElement }>;

    if (!transforms.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const bodyRect = scroller.getBoundingClientRect();
      const viewport = bodyRect.height || scroller.clientHeight || 1;
      const midpoint = bodyRect.top + viewport / 2;

      transforms.forEach(({ item, image }) => {
        const rect = item.getBoundingClientRect();
        const itemMid = rect.top + rect.height / 2;
        const normal = clamp((itemMid - midpoint) / (viewport * 0.4)) * cfg.intensity;
        const depth = 1 - Math.min(1, Math.abs(normal));
        const shadowLift = Math.max(5, depth * cfg.shadowLift);
        const shadowBlur = cfg.shadowBlur + (1 - depth) * cfg.shadowBlur * 0.8;
        const shadowAlpha = cfg.shadowBase + (1 - depth) * cfg.shadowExtra;

        gsap.to(item, {
          rotationX: normal * cfg.rotX,
          rotationY: normal * cfg.rotY,
          y: normal * cfg.liftY,
          z: depth * cfg.depth,
          boxShadow: `0 ${shadowLift}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha})`,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto'
        });

        gsap.to(image, {
          scale: 1 + (1 - depth) * (cfg.scaleBase + cfg.scaleExtra),
          filter: `brightness(${1 + (1 - depth) * (cfg.brightBase + cfg.brightExtra)}) contrast(${1 + (1 - depth) * cfg.contrast}) saturation(${1 + (1 - depth) * cfg.saturation})`,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    };

    const requestUpdate = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    scroller.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    requestUpdate();

    this.modalParallaxCleanups.push(() => {
      scroller.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (raf) cancelAnimationFrame(raf);
      transforms.forEach(({ item, image }) => {
        gsap.killTweensOf([item, image]);
        gsap.set(item, { rotationX: 0, rotationY: 0, y: 0, z: 0, boxShadow: '0 16px 32px rgba(0,0,0,0.25)' });
        gsap.set(image, { scale: 1, filter: 'brightness(1) contrast(1) saturation(1)' });
      });
    });
  }

  private teardownModalParallax(): void {
    if (!this.modalParallaxCleanups.length) return;
    this.modalParallaxCleanups.forEach(fn => fn());
    this.modalParallaxCleanups = [];
  }

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
    // Build a stepped master timeline so each category "owns" scroll while its photos play,
    // then advance horizontally to the next. This blocks background progress during vertical reels.
    const VERTICAL_SEG = 1;   // scroll units for vertical photo reel
    const HORIZONTAL_SEG = 0.35; // scroll units for horizontal slide to next
    const stages = totalCards * 2 - 1; // vertical + horizontal per card except last horizontal
    const tl = gsap.timeline({ defaults: { ease: 'none' } });

    // Ensure all gallery photos have baseline positions
    // Baseline states for per-panel mask slides (first visible by default) and overlay arrow/button
    cards.forEach((panel) => {
      const slides = Array.from(panel.querySelectorAll<SVGImageElement>('.mask-slide'));
      const arrow = panel.querySelector<HTMLElement>('.gallery-scroll-arrow');
      const explore = panel.querySelector<HTMLElement>('.gallery-explore-btn');
      if (slides.length) {
        slides.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
      }
      if (arrow) gsap.set(arrow, { opacity: 1 });
      if (explore) gsap.set(explore, { opacity: 1 });
    });

    const toggleBG = (on: boolean) => {
      const s1 = ScrollTrigger.getById('bg-scene1');
      const s2 = ScrollTrigger.getById('bg-scene2');
      if (on) {
       // s1?.enable();
       // s2?.enable();
      } else {
       // s1?.disable();
       // s2?.disable();
      }
    };

    cards.forEach((panel, i) => {
      const slides = Array.from(panel.querySelectorAll<SVGImageElement>('.mask-slide'));
      // Pause background while vertical reel plays
      tl.call(() => toggleBG(false));

      if (slides.length > 0) {
        const per = VERTICAL_SEG / slides.length;
        // Ensure first is visible
        tl.set(slides[0], { opacity: 1 });
        // Crossfade through slides within the vertical segment window
        for (let s = 1; s < slides.length; s++) {
          tl.to(slides[s], { opacity: 1, duration: per * 0.8 });
          tl.to(slides[s - 1], { opacity: 0, duration: per * 0.8 }, '<');
        }
        // If only one slide, still consume vertical segment time
        if (slides.length === 1) {
          tl.to({}, { duration: VERTICAL_SEG });
        }
      } else {
        // No slides found; still allocate time so horizontal doesn't jump
        tl.to({}, { duration: VERTICAL_SEG });
      }

      // Exit animation for current panel before transitioning (fade images + arrow together)
      const arrow = panel.querySelector<HTMLElement>('.gallery-scroll-arrow');
      const explore = panel.querySelector<HTMLElement>('.gallery-explore-btn');
      if (i < totalCards - 1) {
        if (slides.length) tl.to(slides, { opacity: 0, duration: 0.3 }, '>-0.1');
        if (arrow) tl.to(arrow, { opacity: 0, duration: 0.3 }, '<');
        if (explore) tl.to(explore, { opacity: 0, duration: 0.3 }, '<');
      } else {
        // Also fade the arrow at the end of the last category's vertical reel
        if (arrow) tl.to(arrow, { opacity: 0, duration: 0.3 }, '>-0.1');
        if (explore) tl.to(explore, { opacity: 0, duration: 0.3 }, '<');
      }

      // Horizontal stage: move to next panel (skip for last card)
      if (i < totalCards - 1) {
        // Re-enable background Scene 2 before horizontal advance
        tl.call(() => toggleBG(true));
        tl.to(track, {
          x: () => `-${panelWidth() * (i + 1)}px`,
          duration: HORIZONTAL_SEG
        });
      }
      // If this is the last category, re-enable background once vertical completes
      if (i === totalCards - 1) {
        tl.call(() => toggleBG(true));
      }
    });

    // Pin and scrub the master timeline; snap to each stage boundary
    ScrollTrigger.create({
      animation: tl,
      trigger: gallerySection,
      pin: true,
      scrub: 1.2,
      // Snap at each stage boundary so horizontal doesn't advance until vertical finishes
      snap: gsap.utils.snap(1 / (stages - 1)),
      start: 'top top',
      // Allocate enough scroll distance so the last (Aerial) stage is reachable on all screens
      end: () => "+=" + Math.round(tl.duration() * panelWidth()),
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

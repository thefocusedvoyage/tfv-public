import { Component, Input, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { gsap, ScrollTrigger } from '../../../../vendor/gsap/gsap';

@Component({
  selector: 'app-gallery-cards',
  imports: [],
  templateUrl: './gallery-cards.html',
  styleUrl: './gallery-cards.scss'
})
export class GalleryCards implements AfterViewInit, OnDestroy {

  @Input() card: any = { title: '', description: '', image: '', images: [], dataTarget: 1, lastCategory: false };

  private triggers: ScrollTrigger[] = [];

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // Ensure plugin is registered only once
    if ((gsap as any).registeredScrollTrigger !== true) {
      gsap.registerPlugin(ScrollTrigger);
      (gsap as any).registeredScrollTrigger = true;
    }

    this.setupTextMask();
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    this.triggers = [];
    gsap.killTweensOf(this.host.nativeElement.querySelectorAll('*'));
  }

  /**
   * Text‑Mask Window (SVG): pin the section and crossfade SVG <image> slides
   * through an SVG text mask. Uses subtle Ken Burns (scale + slight pan).
   */
  private setupTextMask() {
    const root = this.host.nativeElement.querySelector<HTMLElement>('[data-mask-root]');
    const svg = root?.querySelector<SVGSVGElement>('.text-mask-svg');
    const title = root?.querySelector<SVGTextElement>('.mask-svg-text');
    if (!root || !svg || !title) return;

    const slides = Array.from(svg.querySelectorAll<SVGImageElement>('.mask-slide'));
    if (!slides.length) return;

    // Initial states for SVG images
    slides.forEach((el, i) => {
      gsap.set(el, { opacity: i === 0 ? 1 : 0, transformOrigin: '50% 50%' });
    });

    const n = slides.length;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${window.innerHeight * (n + 0.2)}`,
        pin: true,
        scrub: true
      }
    });

    slides.forEach((el, i) => {
      const label = `maskFrame${i}`;
      const panX = i % 2 ? 2 : -2; // gentle alternating pan
      const panY = i % 2 ? -1 : 1;
      tl.add(label)
        // Show instantly (no fade-in)
        .set(el, { opacity: 1 }, label)
        // Ken Burns style pan/scale (no opacity tween)
        .to(el, { scale: 1.10, xPercent: panX, yPercent: panY, ease: 'none', duration: 0.8 }, label)
        // Hide instantly (no fade-out)
        .set(el, { opacity: 0 }, `>${0.8}`);
    });

    // Optional: gentle tracking change on the SVG title for a luxe feel
    const titleST = gsap.to(title, {
      attr: { 'letter-spacing': '0.06em' },
      scrollTrigger: {
        trigger: root,
        start: 'top center',
        end: 'bottom center',
        scrub: true
      }
    }).scrollTrigger as ScrollTrigger | undefined;

    if (titleST) this.triggers.push(titleST);
    const st = tl.scrollTrigger as ScrollTrigger | undefined;
    if (st) this.triggers.push(st);
  }
}

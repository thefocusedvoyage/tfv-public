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

    this.setupCoverflow();
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    this.triggers = [];
    gsap.killTweensOf(this.host.nativeElement.querySelectorAll('*'));
  }

  /**
   * Scroll-scrubbed Coverflow with 3D tilt + snap-to-slide.
   * - Pins the section while scrolling through N slides.
   * - Maps scroll progress to the active index in [0, N-1].
   * - Each slide is positioned with X shift, Z depth, rotateY, scale, and opacity based on distance from active.
   */
  private setupCoverflow() {
    const root = this.host.nativeElement.querySelector<HTMLElement>('[data-coverflow-root]');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll<HTMLElement>('.cover-slide'));
    if (!slides.length) return;

    // Create 3D space
    gsap.set(root, { perspective: 1200 });
    slides.forEach(el => gsap.set(el, { transformStyle: 'preserve-3d' }));

    const n = slides.length;

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => `+=${window.innerHeight * Math.max(1, (n - 0.2))}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress * (n - 1);
        slides.forEach((el, i) => {
          const d = i - p; // distance from active slide
          const clamped = gsap.utils.clamp(-2, 2, d);
          const x = clamped * 180;            // side shift
          const z = -Math.abs(clamped) * 160; // depth pushback
          const rY = clamped * -35;           // yaw
          const s = gsap.utils.mapRange(0, 2, 1, 0.85, Math.abs(clamped));
          const o = gsap.utils.clamp(0.25, 1, 1 - Math.abs(clamped) / 2);
          gsap.set(el, { x, z, rotateY: rY, scale: s, opacity: o });
        });
      }
    });
    this.triggers.push(st);

    // Snap to the nearest slide for a premium feel
    const snapST = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      snap: n > 1 ? 1 / (n - 1) : 1,
      scrub: true
    });
    this.triggers.push(snapST);
  }
}

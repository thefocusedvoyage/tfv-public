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
    // Position after initial layout and on resizes
    requestAnimationFrame(() => this.positionArrow());
    window.addEventListener('resize', this.positionArrow);
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
    // Remove per-card pinning/ScrollTriggers to avoid conflicts with the master gallery timeline.
    // Cards render their first slide statically; the gallery-level timeline controls section flow.
  }

  /**
   * Position the overlay arrow just below the SVG text mask on every card,
   * robust across screen sizes.
   */
  private positionArrow = () => {
    const inner = this.host.nativeElement.querySelector<HTMLElement>('.gallery-card-inner');
    const text = this.host.nativeElement.querySelector<SVGTextElement>('.mask-svg-text');
    const overlay = this.host.nativeElement.querySelector<HTMLElement>('.overlay-center');
    const arrow = this.host.nativeElement.querySelector<HTMLElement>('.gallery-scroll-arrow');
    const svgWindow = this.host.nativeElement.querySelector<HTMLElement>('.text-mask-window');
    const svg = this.host.nativeElement.querySelector<SVGSVGElement>('.text-mask-svg');
    if (!inner || !text || !overlay || !arrow || !svgWindow || !svg) return;

    // Measure after layout flush
    requestAnimationFrame(() => {
      const innerRect = inner.getBoundingClientRect();
      const textRect = (text as unknown as Element).getBoundingClientRect();
      const svgRect = svgWindow.getBoundingClientRect();
      // Temporarily place overlay to measure its height
      overlay.style.top = '0px';
      const overlayRect = overlay.getBoundingClientRect();

      // Compute a reliable text height even when the SVG <text> is in a <mask>
      const viewWidth = 1000; // SVG viewBox width
      const fontSizeAttr = parseFloat(text.getAttribute('font-size') || '900');
      const scale = svgRect.width / viewWidth; // pixels per viewBox unit
      const textHeightFallback = fontSizeAttr * scale; // px
      const measuredTextH = textRect.height && textRect.height > 2 ? textRect.height : textHeightFallback;

      // Margin scales with text height for desktop
      const baseMargin = Math.max(16, Math.min(64, measuredTextH * 0.18));

      // Arrow top = center of svg + half text height + margin
      let top = (svgRect.top - innerRect.top) + (svgRect.height / 2) + (measuredTextH / 2) + baseMargin;
      // Clamp within container
      const maxTop = innerRect.height - overlayRect.height - baseMargin;
      const minTop = baseMargin; // keep away from top
      if (Number.isFinite(maxTop)) {
        top = Math.min(Math.max(top, minTop), Math.max(maxTop, minTop));
      }
      overlay.style.top = `${top}px`;
      overlay.style.visibility = 'visible';
    });
  };
}

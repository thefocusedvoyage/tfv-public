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
    // Remove per-card pinning/ScrollTriggers to avoid conflicts with the master gallery timeline.
    // Cards render their first slide statically; the gallery-level timeline controls section flow.
  }
}

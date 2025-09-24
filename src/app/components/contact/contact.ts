import { Component, AfterViewInit, ElementRef, inject, OnDestroy } from '@angular/core';
import { gsap, ScrollTrigger } from '../../../vendor/gsap/gsap';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private idleTimeline?: gsap.core.Timeline;
  private trigger?: ScrollTrigger;

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    const host = this.el.nativeElement;
    const section = host.querySelector('.contact-section') as HTMLElement | null;
    const face = host.querySelector('.contact-face') as HTMLElement | null;
    const eyes = Array.from(host.querySelectorAll('.face-eye')) as HTMLElement[];
    const mouth = host.querySelector('.face-mouth') as HTMLElement | null;

    if (!section || !face || eyes.length === 0 || !mouth) return;

    gsap.set(face, { transformOrigin: '50% 90%' });
    gsap.set(mouth, { scaleY: 0.85, scaleX: 0.95 });
    gsap.set(eyes, { scaleY: 1 });

    this.idleTimeline = gsap.timeline({
      paused: true,
      repeat: -1,
      repeatDelay: 1.4
    });

    this.idleTimeline
      .addLabel('loop')
      .to(face, {
        y: -8,
        rotation: -2,
        duration: 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      }, 'loop')
      .to(mouth, {
        scaleY: 1.2,
        scaleX: 1.05,
        duration: 0.45,
        ease: 'power2.out'
      }, 'loop+=0.05')
      .to(mouth, {
        scaleY: 0.8,
        duration: 0.3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      }, 'loop+=0.7')
      .to(face, {
        rotation: 2,
        duration: 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      }, 'loop+=1.2')
      .to(eyes, {
        scaleY: 0.1,
        duration: 0.08,
        ease: 'power2.in'
      }, 'loop+=1.35')
      .to(eyes, {
        scaleY: 1,
        duration: 0.14,
        ease: 'power2.out'
      }, 'loop+=1.43');

    this.trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => this.idleTimeline?.play(),
      onEnterBack: () => this.idleTimeline?.play(),
      onLeave: () => this.idleTimeline?.pause(0),
      onLeaveBack: () => this.idleTimeline?.pause(0)
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill(true);
    this.idleTimeline?.kill();
  }

}

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID,Output, EventEmitter, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

import {gsap} from '../../../vendor/gsap/gsap';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Loader implements AfterViewInit {
  @Input() showLoader = true;
  @Output() animationDone = new EventEmitter<void>();
  @ViewChild('logoSvg') logoSvg!: ElementRef<SVGSVGElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private cdr: ChangeDetectorRef) {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  ngAfterViewInit(): void {
    const paths = this.logoSvg.nativeElement.querySelectorAll('.draw-path');
    gsap.set(paths, { drawSVG: '0%' });
    gsap.to(paths, {
      drawSVG: '100%',
      duration: 2,
      stagger: 0.1,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.to('.logo-loader', {
          opacity: 0,
          duration: 0.5,
          delay: 1,
          onComplete: () => {
            this.showLoader = false;
            this.cdr.detectChanges(); // Ensure change detection runs to update the view
            this.animationDone.emit();
          }
        });
      }
    });

  }
}

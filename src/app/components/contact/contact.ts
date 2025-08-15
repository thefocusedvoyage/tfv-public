import { Component, AfterViewInit } from '@angular/core';
import { gsap , ScrollTrigger} from '../../../vendor/gsap/gsap';
gsap.registerPlugin(ScrollTrigger);
let height: number;
let speed = 100;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact implements AfterViewInit {

  ngAfterViewInit(): void {
    // Animate SVG paths
    const paths = document.querySelectorAll<SVGPathElement>('.animated-path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length.toString();
      path.style.strokeDashoffset = length.toString();

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 1
      });
    });
  }

}

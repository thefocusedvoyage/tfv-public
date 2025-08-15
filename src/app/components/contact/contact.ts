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
   
  }

}

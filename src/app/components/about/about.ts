import { Component } from '@angular/core';


@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  // Animations removed for About section

  scrollToGallery(): void {
    const gallerySection = document.querySelector('#gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

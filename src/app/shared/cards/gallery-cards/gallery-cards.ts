import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-gallery-cards',
  imports: [],
  templateUrl: './gallery-cards.html',
  styleUrl: './gallery-cards.scss'
})
export class GalleryCards {

  @Input() card: any = { title: '', description: '', image: '', dataTarget: 1, lastCategory: false };
}

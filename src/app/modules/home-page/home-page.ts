import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { About } from '../../components/about/about';
import { Gallery } from "../../components/gallery/gallery";

@Component({
  selector: 'app-home-page',
  imports: [Hero, About, Gallery],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage {


}

import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import {FormsModule} from '@angular/forms';

const COMPONENTS :any[] = [
    // Add your shared components here
];

const MODULES  = [
    CommonModule,
    FormsModule
]

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...MODULES
  ],
  exports: [
    ...COMPONENTS,
    ...MODULES
  ]
})
export class SharedModule { }
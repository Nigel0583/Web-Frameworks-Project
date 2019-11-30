import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AboutPageComponent } from './about-page/about-page.component';

@NgModule({
  declarations: [
    AboutPageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AboutPageComponent]
})
export class AppModule { }

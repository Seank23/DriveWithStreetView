import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxNavbarModule, IgxIconModule } from 'igniteui-angular';
import { GoogleMapsModule } from '@angular/google-maps'
import { HttpClientModule } from '@angular/common/http'
import { Ng5SliderModule } from 'ng5-slider';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { StreetViewComponent } from './street-view/street-view.component';
import { ControlsComponent } from './controls/controls.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      NavMenuComponent,
      LocationSearchComponent,
      StreetViewComponent,
      ControlsComponent
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      ]),
      BrowserAnimationsModule,
      IgxNavbarModule,
      IgxIconModule,
      GoogleMapsModule,
      HttpClientModule,
      Ng5SliderModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

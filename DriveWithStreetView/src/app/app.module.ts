import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxNavbarModule, IgxIconModule } from 'igniteui-angular';
import { GoogleMapsModule } from '@angular/google-maps'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { MapComponent } from './map/map.component';
import { StreetViewComponent } from './street-view/street-view.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      NavMenuComponent,
      MapComponent,
      StreetViewComponent
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      ]),
      BrowserAnimationsModule,
      IgxNavbarModule,
      IgxIconModule,
      GoogleMapsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

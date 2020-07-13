import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxNavbarModule, IgxIconModule } from 'igniteui-angular';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      NavMenuComponent
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      ]),

      BrowserAnimationsModule,
      IgxNavbarModule,
      IgxIconModule,
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

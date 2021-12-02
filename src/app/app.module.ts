import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';

//ngx-bootstrap modules
import { CollapseModule } from "ngx-bootstrap/collapse";
import { CarouselModule } from "ngx-bootstrap/carousel";

//ng recaptcha modules
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";

//block UI module
import { BlockUIModule } from "ng-block-ui";

// app modules
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { OffersComponent } from './components/offers/offers.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BreadCrumbsComponent } from './components/bread-crumbs/bread-crumbs.component';
import { environment } from '../environments/environment';
import { QuoteComponent } from './components/quote/quote.component';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    FooterComponent,
    OffersComponent,
    BookingsComponent,
    BreadCrumbsComponent,
    QuoteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    ReactiveFormsModule,
    RecaptchaV3Module,
    BlockUIModule.forRoot(),
    AutosizeModule
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

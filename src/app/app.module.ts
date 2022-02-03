import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule, Title } from '@angular/platform-browser';

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
import { environment } from '../environments/environment';
import { QuoteComponent } from './components/quote/quote.component';
import { AutosizeModule } from 'ngx-autosize';
import { ContactsComponent } from './components/contacts/contacts.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    FooterComponent,
    OffersComponent,
    BookingsComponent,
    QuoteComponent,
    ContactsComponent,
    PrivacyComponent
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
    Title,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  // define appwide behaviour for scrolling, with timeouts to allow page load
  // EHoltz-https://stackoverflow.com/questions/57962061/angular-8-scroll-to-a-fragment-doesnt-bring-the-fragment-to-the-top-of-the-pag
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if(e.position) {
        // backward navigation - last defined position
        setTimeout(() => {viewportScroller.scrollToPosition(e.position!); }, 0);
      } else if (e.anchor) {
        // anchor navigation - anchor position defined by fragments or links
        setTimeout(() => {viewportScroller.scrollToAnchor(e.anchor!); }, 0);
      } else {
        // forward navigation - top position previous position not defined
        setTimeout(() => {viewportScroller.scrollToPosition([0,0]); }, 0);
      }
    });
  }

}

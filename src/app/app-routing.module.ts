import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { HomeComponent } from './components/home/home.component';
import { OffersComponent } from './components/offers/offers.component';
import { QuoteComponent } from './components/quote/quote.component';

const routes: Routes = [
  {path: 'bookings', component: BookingsComponent},
  {path: 'offers', component: OffersComponent},
  {path: 'quotes', component: QuoteComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: '', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

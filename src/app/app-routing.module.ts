import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from './components/bookings/bookings.component';
import { HomeComponent } from './components/home/home.component';
import { OffersComponent } from './components/offers/offers.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'offers', component: OffersComponent},
  {path: 'bookings', component: BookingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

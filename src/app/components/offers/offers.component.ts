import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mjm-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  goToBookings(){
    this.router.navigateByUrl('bookings');
  }

  goToQuotes(){
    this.router.navigateByUrl('quotes');
  }

}

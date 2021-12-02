import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mjm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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

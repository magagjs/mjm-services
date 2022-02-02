import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mjm-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  docTitle = "MJM - Offers"; // current HTML document title

  constructor(private router:Router, private titleService: Title) { } // 'Title' service is for current HTML document title

  ngOnInit(): void {
    this.titleService.setTitle(this.docTitle);
  }

  goToBookings(){
    this.router.navigateByUrl('bookings');
  }

  goToQuotes(){
    this.router.navigateByUrl('quotes');
  }

}

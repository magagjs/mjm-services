import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mjm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  docTitle = "MJM Service Centre"; // current HTML document title

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

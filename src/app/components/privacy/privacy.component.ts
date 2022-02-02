import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'mjm-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  docTitle = "MJM - Privacy Policy";  // current HTML document title

  constructor(private titleService: Title) { }  // 'Title' service is for current HTML document title

  ngOnInit(): void {
    this.titleService.setTitle(this.docTitle);
  }

}

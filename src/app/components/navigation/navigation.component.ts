import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mjm-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  isCollapsed = false;  // ngx-bootstrap collapse module

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { BreadCrumbDetails } from 'src/app/models/bread-crumb-details';

@Component({
  selector: 'mjm-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss']
})
export class BreadCrumbsComponent implements OnInit {

  @Input()
  public breadCrumbDetails!: BreadCrumbDetails

  constructor() { }

  ngOnInit(): void {
  }

}

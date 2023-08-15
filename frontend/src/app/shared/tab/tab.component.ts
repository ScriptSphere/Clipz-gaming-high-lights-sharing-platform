import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements OnInit {
  @Input() title!: string; // title of the tab
  @Input() active: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}

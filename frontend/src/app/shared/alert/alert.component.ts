import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() styles = 'bg-red-500 text-white';
  @Input() show: boolean = true;
  @Input() time: number = 2; // time to show the alert in seconds
}

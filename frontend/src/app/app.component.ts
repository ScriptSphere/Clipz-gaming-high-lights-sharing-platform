import { Component } from '@angular/core';

import { UserManipService } from './services/user-manip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public userManip: UserManipService) {}
}

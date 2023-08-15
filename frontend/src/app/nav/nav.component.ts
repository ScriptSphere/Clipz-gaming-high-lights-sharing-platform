import { Component, OnInit } from '@angular/core';
import { ModelService } from '../services/model.service';
import { UserManipService } from '../services/user-manip.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(
    public model: ModelService,
    public userScrvice: UserManipService
  ) {}

  showAlert: boolean = false;
  alertContent!: string;
  alertStyles: string = 'bg-green-500 text-white';

  async logoutUser(event: Event) {
    event.preventDefault();

    this.userScrvice.logoutUser();
  }

  ngOnInit(): void {}
  openModel(e: Event) {
    e.preventDefault();

    this.model.toggleModel('auth');
  }
}

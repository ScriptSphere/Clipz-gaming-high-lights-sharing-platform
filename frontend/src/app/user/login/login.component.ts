import { Component, OnInit } from '@angular/core';
import { UserManipService } from 'src/app/services/user-manip.service';
import { NgForm } from '@angular/forms';

interface Credentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials: Credentials = {
    email: '',
    password: '',
  };

  showAlert: boolean = false;
  alertContent!: string;
  alertStyles: string = 'bg-blue-500 text-white';

  async submit(form: NgForm) {
    this.alertContent = 'Working...';
    this.alertStyles = 'text-white bg-blue-500';
    this.showAlert = true;

    this.user
      .loginUser(form.controls['email'].value, form.controls['password'].value)
      .then(() => {
        this.alertContent = 'You are successfully logged in!';
        this.alertStyles = 'text-white bg-green-500';
      })
      .catch(() => {
        this.alertContent = 'failed to login';
        this.alertStyles = 'text-white bg-red-500';
      });
  }

  constructor(private user: UserManipService) {}

  ngOnInit(): void {}
}

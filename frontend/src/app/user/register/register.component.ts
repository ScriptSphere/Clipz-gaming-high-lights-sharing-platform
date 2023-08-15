import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserManipService } from 'src/app/services/user-manip.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
      ),
      age: new FormControl('', [
        Validators.required,
        Validators.min(8),
        Validators.max(120),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(15),
      ]),
    },
    [RegisterValidators.match('password', 'confirmPassword')]
  );
  showAlert: boolean = false;
  alertContent!: string;
  alertStyles: string = 'bg-blue-500 text-white';

  constructor(
    private userService: UserManipService,
    private emailTaken: EmailTaken
  ) {}

  register() {
    this.alertContent = 'Creating account...';
    this.showAlert = true;
    this.alertStyles = 'bg-blue-500 text-white sticky top-0';

    const userData = {
      name: this.registerForm.controls.name?.value,
      email: this.registerForm.controls.email?.value,
      age: Number(this.registerForm.controls.age?.value),
      password: this.registerForm.controls.password?.value,
      phone: this.registerForm.controls.phone?.value,
    };

    this.userService
      .registerUser(userData)
      .then(() => {
        this.alertContent = 'Account Created Successfully!';
        this.showAlert = true;
        this.alertStyles = 'bg-green-500 text-white sticky top-0';
      })
      .catch((error) => {
        this.alertContent = 'Error creating account...';
        this.showAlert = true;
        this.alertStyles = 'bg-red-500 text-white sticky top-0';

        console.log(error);
      });
  }
}

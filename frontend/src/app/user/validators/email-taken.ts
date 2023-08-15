import { UserManipService } from 'src/app/services/user-manip.service';
import { Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
  constructor(private userService: UserManipService) {}
  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve, reject) => {
      this.userService.emailAlreadyTaken(control.value).then((taken) => {
        if (taken) {
          resolve({ emailTaken: true });
        } else {
          resolve(null);
        }
      });
    });
  };
}

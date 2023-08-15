import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { filter, map, switchMap, of } from 'rxjs';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

function checkCookieExistence(cookieName: string) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName + '=') === 0) {
      // The cookie exists
      return true;
    }
  }
  // The cookie does not exist
  return false;
}

@Injectable({
  providedIn: 'root',
})
export class UserManipService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
        map((event) => {
          return this.route.firstChild;
        }),
        switchMap((route: any) => {
          return route?.data ?? of({});
        })
      )
      .subscribe((data: any) => {
        if (data.authOnly) {
          this.redirect = true;
        } else {
          this.redirect = false;
        }
      });
  }

  loggedIn: boolean = !!checkCookieExistence('clipzuser');

  redirect: boolean = false;

  // registeration:
  registerUser(userData: any) {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(`${environment.serverUrl}/register`, userData, {
          responseType: 'text',
        })
        .subscribe({
          next: () => {
            resolve();
          },
          error: (error) => {
            reject();
          },
        });
    });
  }

  // Logging in:
  loginUser(email: string, password: string) {
    // Format of response
    interface resFormat {
      login: boolean;
    }

    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          `${environment.serverUrl}/login`,
          {
            email: email,
            password: password,
          },
          {
            responseType: 'json',
            withCredentials: true,
          }
        )
        .subscribe({
          next: (res) => {
            if ((res as resFormat).login) {
              this.loggedIn = true;
              resolve();
            } else {
              reject();
            }
          },
          error: (error) => {
            reject();
          },
        });
    });
  }

  // logging out:
  logoutUser() {
    // Format of response
    interface resFormat {
      login: boolean;
    }

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(`${environment.serverUrl}/logout`, {
          responseType: 'json',
          withCredentials: true,
        })
        .subscribe({
          next: (res) => {
            if (!(res as resFormat).login) {
              this.loggedIn = false;

              // redirecting the user to the home page if the current page requires authintication:
              if (this.redirect) {
                this.router.navigateByUrl('/');
              }

              resolve();
            } else {
              reject();
            }
          },
          error: () => {
            reject();
          },
        });
    });
  }

  // check if the email is already taken:
  emailAlreadyTaken(email: string) {
    // Format of response
    interface resFormat {
      taken: boolean;
    }

    return new Promise<any>((resolve, reject) => {
      this.http
        .post(`${environment.serverUrl}/email-taken`, { email: email })
        .subscribe({
          next: (res) => {
            console.log(res);
            resolve((res as resFormat).taken);
          },
          error: () => {
            reject();
          },
        });
    });
  }
}

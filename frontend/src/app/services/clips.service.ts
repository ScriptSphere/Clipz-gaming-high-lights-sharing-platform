import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { UserManipService } from './user-manip.service';

@Injectable({
  providedIn: 'root',
})
export class ClipsService {
  constructor(
    private http: HttpClient,
    private userService: UserManipService
  ) {}

  fetchClip(id: string) {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(`${environment.serverUrl}/videos/${id}`, { responseType: 'json' })
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error) => {
            console.log(error);
            reject();
          },
        });
    });
  }

  fetchManyClips(sort: number) {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.serverUrl}/videos/uploads/${sort}`, {
          withCredentials: true,
        })
        .subscribe((response: any) => {
          if (response) {
            resolve(response);
          } else {
            reject(false);
          }
        });
    });
  }

  deleteClip(clipId: string) {
    return new Promise<void>((resolve, reject) => {
      this.http
        .delete(`${environment.serverUrl}/videos/${clipId}`, {
          responseType: 'json',
          withCredentials: true,
        })
        .subscribe((response: any) => {
          if (response.success) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }
}

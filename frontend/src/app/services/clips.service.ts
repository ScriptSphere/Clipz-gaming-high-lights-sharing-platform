import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      this.http.get(`/videos/${id}`, { responseType: 'json' }).subscribe({
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
        .get(`/videos/uploads/${sort}`, {
          withCredentials: true,
        })
        .subscribe((response: any) => {
          if (response) {
            console.log(response);
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
        .delete(`/videos/${clipId}`, {
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

  updateClip(id: string, clip: any) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(`/videos/update/${id}`, { clip: clip }).subscribe({
        next: (res: any) => {
          if (res.updated) {
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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipsService implements Resolve<any> {
  constructor(private http: HttpClient) {}

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

  fetchClipsForInfiniteScroll(clips: number, skip: number) {
    return new Promise((resolve, reject) => {
      this.http
        .get(`/videos?videosNumber=${clips}&videosSkipNumber=${skip}`, {
          withCredentials: true,
          responseType: 'json',
        })
        .subscribe({
          next: (videos) => {
            resolve(videos);
          },
          error: (err) => {
            console.log(err);
            reject();
          },
        });
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];

    return this.fetchClip(id);
  }
}

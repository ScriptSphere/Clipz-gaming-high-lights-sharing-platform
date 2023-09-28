import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  file: File | null = null;
  showForm = false;

  titleControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  videoForm: FormGroup = new FormGroup({
    title: this.titleControl,
  });

  inSubmition: boolean = false;

  alert = {
    message: '',
    styling: 'bg-green-500 text-white sticky top-0 right-0',
    show: false,
  };

  networkSubscription: Subscription | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnDestroy(): void {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
  }

  storeFile(event: Event) {
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files[0] ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type != 'video/mp4') {
      return;
    }

    this.videoForm.controls['title'].setValue(
      this.file.name.replace(/\.[^\.]+$/, '')
    );

    // display the video editing form:
    this.showForm = true;
  }

  uploadFile() {
    // disable the form:
    this.videoForm.disable();

    this.inSubmition = true;

    const formData: FormData = new FormData();
    formData.append('video', this.file as File);
    formData.append('title', this.titleControl.value as string);

    const req = new HttpRequest(
      'POST',
      `${environment.serverUrl}/videos/upload`,
      formData,
      {
        reportProgress: true,
        withCredentials: true,
        responseType: 'json',
      }
    );

    this.networkSubscription = this.http.request(req).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / event.total);
          this.alert.message = `${progress}% done...`;
          if (progress == 100) {
            this.alert.message = 'Uploaded File Successfully!';
            this.alert.styling = 'bg-green-500 text-white sticky top-0 right-0';
            this.alert.show = true;

            setTimeout(() => {
              this.alert.show = false;
            }, 3000);
            this.inSubmition = false;
          }
        } else if (event.type === HttpEventType.Response && event.body) {
          this.router.navigateByUrl(`/clip/${event.body.clipId}`);
        }
      },
      error: (error) => {
        // enabling the form again:
        this.videoForm.enable();

        console.log(error);
        this.alert.message = 'An error occurred uploading the file...';
        this.alert.styling = 'bg-red-500 text-white sticky top-0 right-0';
        this.alert.show = true;

        setTimeout(() => {
          this.alert.show = false;
        }, 3000);
        this.inSubmition = false;
      },
    });

    this.alert.message = '0% done...';
    this.alert.styling = 'bg-blue-500 text-white sticky top-0 right-0';
    this.alert.show = true;
  }
}

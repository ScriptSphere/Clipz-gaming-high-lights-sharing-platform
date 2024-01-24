import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClipsService } from '../services/clips.service';
import videojs from 'video.js';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ClipComponent implements OnInit, AfterViewInit {
  id: string = '';
  video: any = null;

  player?: any;

  numOfNextVideos: number = 6;
  skipNumOfVideos: number = 0;
  loadNextVids: boolean = false;

  @ViewChild('videoPlayer') target?: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.video = data.clip;

      this.skipNumOfVideos = this.video.index + 1;

      this.player?.src({
        src: this.video.filePath,
        type: 'video/mp4',
      });

      this.loadNextVids = true;

      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit(): void {
    if (!this.target) {
      setTimeout(() => this.ngAfterViewInit(), 100);
    } else {
      this.player = videojs(this.target.nativeElement as HTMLElement);
      return;
    }
  }
}

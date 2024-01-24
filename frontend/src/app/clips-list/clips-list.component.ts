import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipsService } from '../services/clips.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable: boolean = true;

  constructor(private clipsService: ClipsService) {}

  @Input() videosNumber: number = 6;

  loadedOnce: boolean = false; // this means that first set of videos have been loaded

  videosSkipNum: number = 0;
  @Input() set videosSkip(skip: number) {
    this.videosSkipNum = skip;

    if (this.loadedOnce) {
      this.videos = [];
      this.pendingRequest = true;
      this.loadVideos().then(() => {
        this.pendingRequest = false;
      });
    }
  }
  @Input() load: boolean = false;
  videos: any[] = [];

  pendingRequest: boolean = false;

  loadInterval = setInterval(() => {
    if (this.load) {
      this.pendingRequest = true;
      this.loadVideos().then(() => {
        this.pendingRequest = false;
        this.loadedOnce = true; // first set of videos loaded
      });

      clearInterval(this.loadInterval);
    }
  }, 500);

  async ngOnInit() {
    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = async () => {
    if (this.pendingRequest) {
      return;
    }

    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if (bottomOfWindow) {
      this.videosSkip += this.videosNumber;
      this.pendingRequest = true;
      await this.loadVideos();
      this.pendingRequest = false;
    }
  };

  loadVideos = async () => {
    this.videos.push(
      ...((await this.clipsService.fetchClipsForInfiniteScroll(
        this.videosNumber,
        this.videosSkipNum
      )) as Array<any>)
    );
  };
}

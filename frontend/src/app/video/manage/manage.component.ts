import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ClipsService } from 'src/app/services/clips.service';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipsService,
    private modelService: ModelService
  ) {}

  videoOrder: string = '1';
  activeEditingClip: null | any = null; // clip which is being edited
  videos!: any[];

  async ngOnInit() {
    this.route.queryParamMap.subscribe((pars: Params) => {
      this.videoOrder = pars['params'].sort == '2' ? pars['params'].sort : '1';
    });

    this.videos = (await this.clipService.fetchManyClips(-1)) as any[];
  }

  async sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;

    // this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });

    this.videos = (await this.clipService.fetchManyClips(
      value == '1' ? -1 : 1
    )) as any[]; // 1 means recent uploads and 2 means new uploads. do arrange the videos in the descending order of their upload, we give -1 as sorting parameter to our server
  }

  copyLink(link: string, e: Event) {
    navigator.clipboard.writeText(window.location.origin + link);

    (e.target as HTMLAnchorElement).innerText = 'Copied!';

    setTimeout(() => {
      (e.target as HTMLAnchorElement).innerText = 'Copy Link';
    }, 2000);
  }

  deleteClip(id: string) {
    this.clipService
      .deleteClip(id)
      .then(async () => {
        console.log('success');
        this.videos = (await this.clipService.fetchManyClips(-1)) as any[];
      })
      .catch(() => {
        console.log('failed');
      });
  }

  editClip(event: Event, clip: any) {
    this.activeEditingClip = clip;

    this.modelService.toggleModel('edit-clip');
  }

  updateClip(event: any) {
    let index = 0;

    for (let video of this.videos) {
      if (video._id === event._id) {
        this.videos[index].title = event.title;
        break;
      }
      index++;
    }
  }
}

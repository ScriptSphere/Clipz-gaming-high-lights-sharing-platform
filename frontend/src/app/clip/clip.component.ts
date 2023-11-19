import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClipsService } from '../services/clips.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
})
export class ClipComponent implements OnInit {
  id: string = '';
  video: any = null;
  env = environment;

  constructor(
    private route: ActivatedRoute,
    private clipService: ClipsService
  ) {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.clipService
      .fetchClip(this.id)
      .then((clip) => {
        this.video = clip;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnInit(): void {}
}

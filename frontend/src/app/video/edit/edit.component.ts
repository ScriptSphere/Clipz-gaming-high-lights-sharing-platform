import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  constructor(private modelService: ModelService) {}

  ngOnInit(): void {
    this.modelService.register('edit-clip');
  }

  ngOnDestroy(): void {
    this.modelService.unregister('edit-clip');
  }
}

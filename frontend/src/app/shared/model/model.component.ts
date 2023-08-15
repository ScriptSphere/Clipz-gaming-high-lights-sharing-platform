import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
  // providers: [ModelService],
})
export class ModelComponent implements OnInit, OnDestroy {
  constructor(public model: ModelService, public hostElm: ElementRef) {}
  @Input() id!: string;

  ngOnInit(): void {
    this.model.register(this.id);
    // moving the model to the body element:
    document.body.appendChild(this.hostElm.nativeElement);
  }
  closeModel() {
    this.model.toggleModel(this.id);
  }

  ngOnDestroy(): void {
    this.model.unregister(this.id);

    document.body.removeChild(this.hostElm.nativeElement);
  }
}

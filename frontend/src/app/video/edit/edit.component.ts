import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { ClipsService } from 'src/app/services/clips.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeEditingClip: any | null = null;
  @Output() updateParent = new EventEmitter();

  titleControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  inSubmition: boolean = false;

  editForm: FormGroup = new FormGroup({
    title: this.titleControl,
  });

  alert: any = {
    styling: '',
    message: '',
    show: false,
  };

  constructor(
    private modelService: ModelService,
    private clipsService: ClipsService
  ) {}

  ngOnInit(): void {
    this.modelService.register('edit-clip');
  }

  ngOnDestroy(): void {
    this.modelService.unregister('edit-clip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeEditingClip) {
      return;
    }

    this.titleControl.setValue(this.activeEditingClip.title);

    this.inSubmition = false;
    this.alert.show = false;
  }

  updateClip() {
    if (!this.activeEditingClip) {
      return;
    }

    this.inSubmition = true;
    this.alert.message = 'Please Wait... Updating the clip';
    this.alert.styling = 'bg-blue-500';
    this.alert.show = true;
    this.clipsService
      .updateClip(this.activeEditingClip._id, this.editForm.value)
      .then(() => {
        this.alert.message = 'Successfully updated clip';
        this.alert.styling = 'bg-green-500';

        setTimeout(() => {
          this.alert.show = false;
        }, 3000);

        this.inSubmition = false;

        this.activeEditingClip.title = this.titleControl.value;
        this.updateParent.emit(this.activeEditingClip);
      })
      .catch(() => {
        this.alert.message = 'Error updating clip';
        this.alert.styling = 'bg-red-500';

        setTimeout(() => {
          this.alert.show = false;
        }, 3000);

        this.inSubmition = false;
      });
  }
}

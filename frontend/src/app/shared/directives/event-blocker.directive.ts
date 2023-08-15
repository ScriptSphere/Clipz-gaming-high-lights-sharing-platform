import { Directive } from '@angular/core';
import { HostListener } from '@angular/core';

@Directive({
  selector: '[event-blocker]',
})
export class EventBlockerDirective {
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  handleEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

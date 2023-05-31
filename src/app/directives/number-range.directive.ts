import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numberRange]',
})
export class NumberRangeDirective {
  constructor(private hostElement: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onKeypress(e) {
    if (+e.target.value < this.control?.errors?.min?.min) {
      this.hostElement.nativeElement.value = this.control?.errors?.min?.min;
    } else if (+e.target.value > this.control?.errors?.max?.max) {
      this.hostElement.nativeElement.value = this.control?.errors?.max?.max;
    }
  }
}

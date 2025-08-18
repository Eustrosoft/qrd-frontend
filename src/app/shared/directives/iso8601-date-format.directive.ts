import { Directive, HostListener, inject } from '@angular/core';
import { FormControlDirective } from '@angular/forms';
import { Iso8601DateFormatPipe } from '@shared/pipe/iso8601-date-format.pipe';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Directive({
  selector: '[iso8601DateFormat]',
})
export class Iso8601DateFormatDirective {
  private readonly formControl = inject(FormControlDirective, { host: true });
  private readonly iso8601DateFormatPipe = inject(Iso8601DateFormatPipe);

  @HostListener('dateChange', ['$event'])
  private onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.formControl.control.setValue(this.iso8601DateFormatPipe.transform(event.value), { emitEvent: false });
  }
}

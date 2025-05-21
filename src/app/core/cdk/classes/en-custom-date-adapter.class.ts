import { NativeDateAdapter } from '@angular/material/core';

export class EnCustomDateAdapter extends NativeDateAdapter {
  public override getFirstDayOfWeek(): number {
    return 0;
  }
}

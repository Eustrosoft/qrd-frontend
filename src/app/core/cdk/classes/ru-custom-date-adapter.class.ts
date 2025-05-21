import { NativeDateAdapter } from '@angular/material/core';
import { inject } from '@angular/core';
import { RuDateAdapterParsePipe } from '@shared/pipe/ru-adapter-parse.pipe';

export class RuCustomDateAdapter extends NativeDateAdapter {
  private readonly ruAdapterParsePipe: RuDateAdapterParsePipe = inject(RuDateAdapterParsePipe);

  public override getFirstDayOfWeek(): number {
    return 1;
  }

  // eslint-disable-next-line
  public override parse(value: any, parseFormat?: any): Date | null {
    return this.ruAdapterParsePipe.transform(value);
  }
}

import { NativeDateAdapter } from '@angular/material/core';
import { inject } from '@angular/core';
import { RuDateAdapterParsePipe } from '@shared/pipe/ru-adapter-parse.pipe';
import { Iso8601DateFormatPipe } from '@shared/pipe/iso8601-date-format.pipe';

export class RuCustomDateAdapter extends NativeDateAdapter {
  private readonly ruAdapterParsePipe = inject(RuDateAdapterParsePipe);
  private readonly iso8601DateFormatPipe = inject(Iso8601DateFormatPipe);

  public override getFirstDayOfWeek(): number {
    return 1;
  }

  // eslint-disable-next-line
  public override parse(value: any, parseFormat?: any): Date | null {
    return this.ruAdapterParsePipe.transform(value);
  }

  public override createDate(year: number, month: number, date: number): Date {
    return new Date(Date.UTC(year, month, date));
  }
}

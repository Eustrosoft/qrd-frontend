import { Provider } from '@angular/core';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { BoolToTextPipe } from '@shared/pipe/bool-to-text.pipe';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { ContentDispositionHeaderParsePipe } from '@shared/pipe/content-disposition-header-parse.pipe';
import { RuDateAdapterParsePipe } from '@shared/pipe/ru-adapter-parse.pipe';
import { QrRangePipe } from '@shared/pipe/qr-range.pipe';
import { Iso8601DateFormatPipe } from '@shared/pipe/iso8601-date-format.pipe';

export function providePipes(): Provider[] {
  return [
    PxToRemPipe,
    ToHexPipe,
    QrRangePipe,
    BytesToSizePipe,
    BoolToTextPipe,
    FallbackPipe,
    ContentDispositionHeaderParsePipe,
    RuDateAdapterParsePipe,
    Iso8601DateFormatPipe,
  ];
}

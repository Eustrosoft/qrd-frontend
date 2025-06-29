import { Provider } from '@angular/core';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { BoolToTextPipe } from '@shared/pipe/bool-to-text.pipe';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';

export function providePipes(): Provider[] {
  return [PxToRemPipe, ToHexPipe, BytesToSizePipe, BoolToTextPipe, FallbackPipe];
}

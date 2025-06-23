import { Provider } from '@angular/core';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';

export function providePipes(): Provider[] {
  return [PxToRemPipe, ToHexPipe, BytesToSizePipe];
}

import { Provider } from '@angular/core';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';

export function providePipes(): Provider[] {
  return [PxToRemPipe, ToHexPipe];
}

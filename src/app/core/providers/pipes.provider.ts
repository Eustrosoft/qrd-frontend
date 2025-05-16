import { Provider } from '@angular/core';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';

export function providePipes(): Provider[] {
  return [PxToRemPipe];
}

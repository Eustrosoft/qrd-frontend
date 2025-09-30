import { Provider } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { baseHrefFactory } from '@cdk/factories/base-href.factory';

export function provideBaseHref(): Provider {
  return {
    provide: APP_BASE_HREF,
    useFactory: baseHrefFactory,
  };
}

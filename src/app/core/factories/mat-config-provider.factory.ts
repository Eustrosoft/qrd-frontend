import { InjectionToken, Provider } from '@angular/core';

export function provideMatConfigValue<T>(token: InjectionToken<T>, value: T): Provider {
  return {
    provide: token,
    useValue: value,
  };
}

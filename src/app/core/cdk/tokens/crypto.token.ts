import { DOCUMENT, inject, InjectionToken } from '@angular/core';

interface CryptoProvider {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
}

export const CRYPTO: InjectionToken<CryptoProvider> = new InjectionToken('window.crypto', {
  factory: (): CryptoProvider => {
    const win = inject(DOCUMENT).defaultView;

    if (!win?.crypto?.getRandomValues) {
      throw new Error('Web Crypto API is not available');
    }

    return {
      getRandomValues: <T extends ArrayBufferView>(array: T): T => win.crypto.getRandomValues(array),
    };
  },
});

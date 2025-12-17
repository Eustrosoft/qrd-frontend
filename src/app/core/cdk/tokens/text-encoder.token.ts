import { InjectionToken } from '@angular/core';

interface TextEncoderProvider {
  encode(array?: string): Uint8Array;
}

export const TEXT_ENCODER: InjectionToken<TextEncoderProvider> = new InjectionToken('TextEncoder', {
  factory: (): TextEncoderProvider => {
    const encoder = new TextEncoder();
    return {
      encode: (string?: string): Uint8Array => encoder.encode(string),
    };
  },
});

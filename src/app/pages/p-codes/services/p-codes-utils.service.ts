import { inject, Injectable } from '@angular/core';
import { Pin2Length, YesNo } from '@app/pages/p-codes/p-codes.models';
import { Pin2Alphabet, Pin2Sizes } from '@app/pages/p-codes/p-codes.constants';
import { CRYPTO } from '@cdk/tokens/crypto.token';

@Injectable({
  providedIn: 'root',
})
export class PCodesUtilsService {
  private readonly crypto = inject(CRYPTO);

  private readonly BoolYNMap = new Map<boolean, YesNo>([
    [true, 'Y'],
    [false, 'N'],
  ]);

  public toBoolean(value: YesNo | string | null | undefined): boolean {
    return value === 'Y';
  }

  public toYesNo(value: boolean): YesNo | string {
    return this.BoolYNMap.get(value)!;
  }

  public makeRandomPin(length?: Pin2Length): string {
    const alphabet = Pin2Alphabet;
    const alphabetLength = alphabet.length;

    const finalLength: Pin2Length =
      length ?? Pin2Sizes[this.crypto.getRandomValues(new Uint8Array(1))[0] % Pin2Sizes.length];

    const randomValues = new Uint32Array(finalLength);
    this.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < finalLength; i++) {
      result += alphabet[randomValues[i] % alphabetLength];
    }

    return result;
  }
}

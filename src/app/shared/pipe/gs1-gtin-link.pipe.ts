import { Pipe, PipeTransform } from '@angular/core';
import { select } from '@ngxs/store';
import { AppSelectors } from '@app/state/app.selectors';
import { DefaultConfig } from '@shared/shared.constants';

@Pipe({
  name: 'gs1GtinLink',
})
export class Gs1GtinLinkPipe implements PipeTransform {
  private readonly configState = select(AppSelectors.getConfigState$);

  public transform(
    gtin?: string | number | null,
    key?: string | null,
    value?: string | null,
    tail?: string | null,
  ): string {
    const qrUri = this.configState().config.qrdConf?.qrUri ?? DefaultConfig.qrdConf.qrUri;

    let url = `${qrUri}/01`;

    if (gtin) {
      url += `/${encodeURIComponent(gtin?.toString()?.trim().trim())}`;
    }

    if (key) {
      url += `/${encodeURIComponent(key.trim())}`;
    }

    if (value) {
      url += `/${encodeURIComponent(value.trim())}`;
    }

    if (tail) {
      url += `/${tail.trim()}`;
    }

    return url;
  }
}

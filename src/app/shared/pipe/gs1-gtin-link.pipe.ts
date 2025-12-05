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
    const gtinStr = gtin?.toString()?.trim();

    if (!gtinStr?.length) {
      return '';
    }

    const qrUri = this.configState().config.qrdConf?.qrUri ?? DefaultConfig.qrdConf.qrUri;

    let url = `${qrUri}/01/${encodeURIComponent(gtinStr)}`;

    if (key && value) {
      url += `/${encodeURIComponent(key.trim())}/${encodeURIComponent(value.trim())}`;
    }

    if (tail) {
      url += `/${encodeURIComponent(tail.trim())}`;
    }

    return url;
  }
}

import { RuCustomDateAdapter } from '@cdk/classes/ru-custom-date-adapter.class';
import { EnCustomDateAdapter } from '@cdk/classes/en-custom-date-adapter.class';
import { Locale } from '@app/app.models';

export const localizedDateAdapterFactory = (localeId: Locale): EnCustomDateAdapter | RuCustomDateAdapter => {
  switch (localeId) {
    case 'en-US':
      return new EnCustomDateAdapter();
    case 'ru-RU':
      return new RuCustomDateAdapter();
    default:
      return new RuCustomDateAdapter();
  }
};

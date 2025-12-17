import { components } from '@api/schema';

export type Gs1Dto = components['schemas']['GSLabel'];

export type Gs1CreationDto = Omit<
  Pick<components['schemas']['GSLabel'], 'qrId' | 'rtype' | 'gtin' | 'key' | 'value' | 'tail' | 'comment'>,
  'gtin'
> & { gtin: number | null };

export type Gs1ChangeDto = Omit<
  Pick<components['schemas']['GSLabel'], 'id' | 'qrId' | 'rtype' | 'gtin' | 'key' | 'value' | 'tail' | 'comment'>,
  'gtin'
> & { gtin: number | null };

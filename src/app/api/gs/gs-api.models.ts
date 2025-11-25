import { components } from '@api/schema';

export type Gs1Dto = components['schemas']['GSLabel'];

export type Gs1CreationDto = Pick<
  components['schemas']['GSLabel'],
  'qrId' | 'rtype' | 'gtin' | 'key' | 'value' | 'tail' | 'comment'
>;

export type Gs1ChangeDto = Pick<
  components['schemas']['GSLabel'],
  'id' | 'qrId' | 'rtype' | 'gtin' | 'key' | 'value' | 'tail' | 'comment'
>;

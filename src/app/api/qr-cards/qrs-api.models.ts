import { components } from '@api/schema';

export type QRDto = Omit<components['schemas']['QRDto'], 'data'> & {
  data: components['schemas']['QRChangeDto']['data'];
};

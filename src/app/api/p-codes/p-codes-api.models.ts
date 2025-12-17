import { components } from '@api/schema';

export type PCodeDto = components['schemas']['PCode'];

export type MappedPCodeDto = Omit<components['schemas']['PCode'], 'hfields' | 'hfiles'> & {
  hfields: boolean;
  hfiles: boolean;
};

export type PCodeCreationDto = PCodeDto;

export type PCodeChangeDto = PCodeDto;

import { components } from '@api/schema';

export type QRDto = Omit<components['schemas']['QRDto'], 'data'> & {
  data: components['schemas']['QRChangeDto']['data'];
  qrCardPreviewUrl: string;
};
export type QRCreationDto = Pick<components['schemas']['QRCreationDto'], 'name' | 'description' | 'formId' | 'rangeId'>;
export type QRChangeDto = Omit<components['schemas']['QRChangeDto'], 'data' | 'filesIds'> & {
  data: Record<string, unknown>;
  filesIds: string[];
};
export type FieldDto = components['schemas']['FormFieldDto'];

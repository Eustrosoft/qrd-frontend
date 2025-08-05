export type QrTableColumnFieldName = 'code_picture' | 'code' | 'name' | 'description' | 'created' | 'updated';
export type Column = {
  type: string;
  fieldName: QrTableColumnFieldName;
  name: string;
  enable: true;
};
export type SettingsDto = {
  settings: {
    language: string;
    qrTableColumns: Column[];
    defaultQrPrintText: string;
    defaultQrPrintTextDown: string;
    checkUploadSize: boolean;
  };
};

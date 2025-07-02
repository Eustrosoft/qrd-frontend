import { FileStorageType } from '@api/files/file-api.models';
import { FileStorageTypeItem } from '@shared/shared.models';

export const SharedLocalization = {
  login: $localize`:@@shared.login:Login`,
  logout: $localize`:@@shared.logout:Logout`,
  settings: $localize`:@@shared.settings:Settings`,
  language: $localize`:@@shared.language:Language`,
  mainPage: $localize`:@@shared.mainPage:Main`,
  defaultTitle: $localize`:@@shared.defaultTitle:QRD`,
  name: $localize`:@@shared.name:Name`,
  noName: $localize`:@@shared.noName:No name`,
  originalName: $localize`:@@shared.originalName:Original name`,
  noOriginalName: $localize`:@@shared.noOriginalName:No original name`,
  description: $localize`:@@shared.description:Description`,
  noDescription: $localize`:@@shared.noDescription:No description`,
  template: $localize`:@@shared.template:Template`,
  noTemplate: $localize`:@@shared.noTemplate:No template`,
  noFiles: $localize`:@@shared.noFiles:No files`,
  noAttrs: $localize`:@@shared.noAttrs:No attributes`,
  empty: $localize`:@@shared.empty:Empty`,
  cardPreview: $localize`:@@shared.cardPreview:Card preview`,
  card: $localize`:@@shared.card:Card`,
  search: $localize`:@@shared.search:Search`,
  list: $localize`:@@shared.list:List`,
  table: $localize`:@@shared.table:Table`,
  open: $localize`:@@shared.open:Open`,
  download: $localize`:@@shared.download:Download`,
  edit: $localize`:@@shared.edit:Edit`,
  print: $localize`:@@shared.print:Print`,
  delete: $localize`:@@shared.delete:Delete`,
  selected: $localize`:@@shared.selected:Selected`,
  selectAll: $localize`:@@shared.selectAll:Select all`,
  createDate: $localize`:@@shared.createDate:Created at`,
  updateDate: $localize`:@@shared.updateDate:Last updated at`,
  fileLocation: $localize`:@@shared.fileLocation:File location`,
  storedInS3: $localize`:@@shared.storedInS3:Stored in S3`,
  storedInDB: $localize`:@@shared.storedInDB:Stored in database`,
  storedLocally: $localize`:@@shared.storedLocally:Stored locally`,
  storedExternally: $localize`:@@shared.storedExternally:Stored externally`,
  isPublic: $localize`:@@shared.isPublic:Publicly available`,
  nonPublic: $localize`:@@shared.nonPublic:Publicly unavailable`,
  isStatic: $localize`:@@shared.isStatic:Static`,
  nonStatic: $localize`:@@shared.nonStatic:Non static`,
  isActive: $localize`:@@shared.isActive:Is active`,
  isInactive: $localize`:@@shared.isInactive:Is inactive`,
  yes: $localize`:@@shared.yes:Yes`,
  no: $localize`:@@shared.no:No`,
  unknown: $localize`:@@shared.unknown:Unknown`,
  close: $localize`:@@shared.close:Close`,
  dev: $localize`:@@shared.dev:Under development`,
} as const;

export const SizeUnitsLocalization = {
  b: $localize`:@@sizeUnits.bytes:B`,
  kb: $localize`:@@sizeUnits.kb:KB`,
  mb: $localize`:@@sizeUnits.mb:MB`,
  gb: $localize`:@@sizeUnits.gb:GB`,
  tb: $localize`:@@sizeUnits.tb:TB`,
  pb: $localize`:@@sizeUnits.pb:PB`,
  eb: $localize`:@@sizeUnits.eb:EB`,
  zb: $localize`:@@sizeUnits.zb:ZB`,
  yb: $localize`:@@sizeUnits.yb:YB`,
};

export const LocalesLocalization = {
  ruRu: $localize`:@@locales.ruRu:Russian`,
  enUS: $localize`:@@locales.enUS:English (US)`,
} as const;

export const RouteTitles = {
  login: $localize`:@@routes.login:Login`,
  cards: $localize`:@@routes.cards:Cards`,
  card: $localize`:@@routes.card:Card`,
  attrs: $localize`:@@routes.attrs:Attributes`,
  usages: $localize`:@@routes.usages:Usages`,
  templates: $localize`:@@routes.templates:Templates`,
  files: $localize`:@@routes.files:Files`,
  file: $localize`:@@routes.file:File`,
  docs: $localize`:@@routes.docs:Docs`,
  devSandbox: $localize`:@@routes.devSandbox:Dev Sandbox`,
} as const;

export const FileStorageTypeMap = new Map<FileStorageType | null | undefined, FileStorageTypeItem>([
  ['S3', { text: SharedLocalization.storedInS3, icon: 'cloud' }],
  ['DB', { text: SharedLocalization.storedInDB, icon: 'database' }],
  ['LOCAL', { text: SharedLocalization.storedLocally, icon: 'folder' }],
  ['URL', { text: SharedLocalization.storedExternally, icon: 'http' }],
]);

export const WEB_REGEXP =
  /^(https?:\/\/)?([a-zA-Zа-яёА-ЯЁ0-9-]+\.)+[a-zA-Zа-яёА-ЯЁ]{2,}(\/[a-zA-Zа-яёА-ЯЁ0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;

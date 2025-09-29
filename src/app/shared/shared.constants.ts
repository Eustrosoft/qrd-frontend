import { FileStorageType } from '@api/files/files-api.models';
import { FileStorageTypeItem } from '@shared/shared.models';
import { AppConfig, AppLayoutConfig } from '@app/app.models';
import { HeaderLocalization } from '@shared/components/qrd-header/qrd-header.constants';
import { FooterLocalization } from '@shared/components/qrd-footer/qrd-footer.constants';

export const SharedLocalization = {
  login: $localize`:@@shared.login:Login`,
  logout: $localize`:@@shared.logout:Logout`,
  settings: $localize`:@@shared.settings:Settings`,
  language: $localize`:@@shared.language:Language`,
  mainPage: $localize`:@@shared.mainPage:Main`,
  defaultTitle: $localize`:@@shared.defaultTitle:QRD`,
  code: $localize`:@@shared.code:Code`,
  fieldRequired: $localize`:@@shared.fieldRequired:Field required`,
  maxLength: $localize`:@@shared.maxLength:Max length is`,
  mustBeUrl: $localize`:@@shared.mustBeUrl:Must be a valid URL`,
  redirectLink: $localize`:@@shared.redirectLink:Redirect link`,
  name: $localize`:@@shared.name:Name`,
  noName: $localize`:@@shared.noName:No name`,
  emptyName: $localize`:@@shared.emptyName:Empty name`,
  emptyList: $localize`:@@shared.emptyList:List is empty`,
  originalName: $localize`:@@shared.originalName:Original name`,
  noOriginalName: $localize`:@@shared.noOriginalName:No original name`,
  description: $localize`:@@shared.description:Description`,
  noDescription: $localize`:@@shared.noDescription:No description`,
  action: $localize`:@@shared.action:Action`,
  ranges: $localize`:@@shared.ranges:Ranges`,
  range: $localize`:@@shared.range:Range`,
  template: $localize`:@@shared.template:Template`,
  noTemplate: $localize`:@@shared.noTemplate:No template`,
  openTemplate: $localize`:@@shared.openTemplate:Open template`,
  noFiles: $localize`:@@shared.noFiles:No files`,
  noAttrs: $localize`:@@shared.noAttrs:No attributes`,
  noUsages: $localize`:@@shared.noUsages:No usages`,
  empty: $localize`:@@shared.empty:Empty`,
  cardPreview: $localize`:@@shared.cardPreview:Card preview`,
  card: $localize`:@@shared.card:Card`,
  createCard: $localize`:@@shared.createCard:Create card`,
  actions: $localize`:@@shared.actions:Actions`,
  openAdvancedSearch: $localize`:@@shared.openAdvancedSearch:Open advanced search`,
  openDataAttrsMenu: $localize`:@@shared.openDataAttrsCfg:Open attrs view settings menu`,
  search: $localize`:@@shared.search:Search`,
  performSearch: $localize`:@@shared.performSearch:Perform search`,
  clearSearchString: $localize`:@@shared.clearSearchString:Clear search string`,
  openMoreMenu: $localize`:@@shared.openMoreMenu:Open more menu`,
  list: $localize`:@@shared.list:List`,
  table: $localize`:@@shared.table:Table`,
  open: $localize`:@@shared.open:Open`,
  download: $localize`:@@shared.download:Download`,
  edit: $localize`:@@shared.edit:Edit`,
  print: $localize`:@@shared.print:Print`,
  create: $localize`:@@shared.create:Create`,
  delete: $localize`:@@shared.delete:Delete`,
  deleteRelation: $localize`:@@shared.deleteRelation:Delete relation`,
  selectRecord: $localize`:@@shared.selectRecord:Select record checkbox`,
  selected: $localize`:@@shared.selected:Selected`,
  selectAll: $localize`:@@shared.selectAll:Select all`,
  createDate: $localize`:@@shared.createDate:Created at`,
  updateDate: $localize`:@@shared.updateDate:Last updated at`,
  fileLocation: $localize`:@@shared.fileLocation:File location`,
  storedInS3: $localize`:@@shared.storedInS3:Stored in S3`,
  storedInDB: $localize`:@@shared.storedInDB:Stored in database`,
  storedLocally: $localize`:@@shared.storedLocally:Stored locally`,
  storedExternally: $localize`:@@shared.storedExternally:Stored externally`,
  isPubliclyAvailable: $localize`:@@shared.isPubliclyAvailable:Publicly available`,
  nonPubliclyAvailable: $localize`:@@shared.nonPubliclyAvailable:Publicly unavailable`,
  isPublic: $localize`:@@shared.isPublic:Public`,
  nonPublic: $localize`:@@shared.nonPublic:Non public`,
  isStatic: $localize`:@@shared.isStatic:Static`,
  nonStatic: $localize`:@@shared.nonStatic:Non static`,
  isActive: $localize`:@@shared.isActive:Is active`,
  isInactive: $localize`:@@shared.isInactive:Is inactive`,
  yes: $localize`:@@shared.yes:Yes`,
  no: $localize`:@@shared.no:No`,
  unknown: $localize`:@@shared.unknown:Unknown`,
  attach: $localize`:@@shared.attach:Attach`,
  save: $localize`:@@shared.save:Save`,
  close: $localize`:@@shared.close:Close`,
  cancel: $localize`:@@shared.cancel:Cancel`,
  add: $localize`:@@shared.add:Add`,
  ok: $localize`:@@shared.ok:OK`,
  value: $localize`:@@shared.value:Value`,
  placeholder: $localize`:@@shared.placeholder:Placeholder`,
  selectExisting: $localize`:@@shared.selectExisting:Select existing`,
  pickAFile: $localize`:@@shared.pickAFile:Pick a file`,
  loading: $localize`:@@shared.loading:Loading...`,
  dev: $localize`:@@shared.dev:Under development`,
  showMore: $localize`:@@shared.showMore:Show more`,
  showLess: $localize`:@@shared.showLess:Show less`,
  goBack: $localize`:@@shared.goBack:Go back`,
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
  ruRu: $localize`:@@locales.ruRu:Русский`,
  enUS: $localize`:@@locales.enUS:English (US)`,
  bgBg: $localize`:@@locales.bgBg:Български`,
} as const;

export const RouteTitles = {
  login: $localize`:@@routes.login:Login`,
  cards: $localize`:@@routes.cards:Cards`,
  card: $localize`:@@routes.card:Card`,
  newCard: $localize`:@@routes.newCard:New card`,
  attrs: $localize`:@@routes.attrs:Attributes`,
  lostAttrs: $localize`:@@routes.lostAttrs:Lost attributes`,
  usages: $localize`:@@routes.usages:Usages`,
  templates: $localize`:@@routes.templates:Templates`,
  template: $localize`:@@routes.template:Template`,
  newTemplate: $localize`:@@routes.newTemplate:New template`,
  files: $localize`:@@routes.files:Files`,
  file: $localize`:@@routes.file:File`,
  newFile: $localize`:@@routes.newFile:New file`,
  edit: $localize`:@@routes.edit:Edit`,
  docs: $localize`:@@routes.docs:Docs`,
  settings: $localize`:@@routes.settings:Settings`,
  passwordChange: $localize`:@@routes.passwordChange:Password change`,
  devSandbox: $localize`:@@routes.devSandbox:Dev Sandbox`,
} as const;

export const FileStorageTypeMap = new Map<FileStorageType | null | undefined, FileStorageTypeItem>([
  ['S3', { text: SharedLocalization.storedInS3, icon: 'cloud' }],
  ['DB', { text: SharedLocalization.storedInDB, icon: 'database' }],
  ['LOCAL', { text: SharedLocalization.storedLocally, icon: 'folder' }],
  ['URL', { text: SharedLocalization.storedExternally, icon: 'http' }],
]);

export const WebRegExp =
  /^(https?:\/\/)?([a-zA-Zа-яёА-ЯЁ0-9-]+\.)+[a-zA-Zа-яёА-ЯЁ]{2,}(\/[a-zA-Zа-яёА-ЯЁ0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;

export const DefaultConfig: AppConfig = {
  qrdConf: {
    signUpUri: { uri: '#', disabled: true },
    forgotPassUri: { uri: '#', disabled: true },
    oldAppUri: { uri: '/lk/', disabled: false },
    qrgenUri: 'https://qrgen.qxyz.ru/generate',
    qrUri: 'https://qr.qxyz.ru',
    langList: [
      {
        lang: 'en-US',
        name: 'Engish (US)',
        default: true,
      },
      {
        lang: 'ru-RU',
        name: 'Русский',
      },
      {
        lang: 'bg-BG',
        name: 'Български',
      },
    ],
  },
};

export const DefaultLayoutConfig: AppLayoutConfig = {
  logo: { uri: 'public/img/logo.webp', alt: 'logo' },
  header: {
    title: HeaderLocalization.qrForBusiness,
    tagline: '',
    nav: [
      { title: HeaderLocalization.cards, uri: 'qr-cards' },
      { title: HeaderLocalization.templates, uri: 'templates' },
      { title: HeaderLocalization.files, uri: 'files' },
      { title: HeaderLocalization.docs, uri: 'docs' },
    ],
  },
  footer: {
    title: 'QR Demo',
    tagline: FooterLocalization.qrForAll,
    blocks: [
      {
        title: 'QR Demo',
        links: [
          { title: FooterLocalization.trainingVideo, uri: 'about' },
          { title: FooterLocalization.loginPage, uri: 'login' },
        ],
      },
      {
        title: FooterLocalization.services,
        links: [
          { title: 'QXYZ', uri: 'https://qxyz.ru' },
          { title: 'QR Demo', uri: 'https://qrdemo.qxyz.ru' },
        ],
      },
      {
        title: FooterLocalization.contacts,
        links: [
          {
            title: 'qrdemo@eustrosoft.org',
            uri: 'mailto:qrdemo@eustrosoft.org',
          },
          {
            title: '+7(995)116-16-01',
            uri: 'tel:+79951161601',
          },
        ],
      },
    ],
    copyright: {
      title: 'eustrosoft.org',
      uri: 'https://eustrosoft.org',
    },
  },
};

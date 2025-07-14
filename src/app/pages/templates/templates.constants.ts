import { DEFAULT_ITEMS_PER_PAGE } from '@app/app.constants';
import { TemplatesStateModel } from '@app/pages/templates/state/templates.state';

export const TemplatesLocalization = {
  creation: $localize`:@@templates.creation:Create new template`,
  editing: $localize`:@@templates.editing:Edit template`,
  dataType: $localize`:@@templates.dataType:Data type`,
  position: $localize`:@@templates.pos:Position`,
};

export const DEFAULT_TEMPLATE_STATE: TemplatesStateModel = {
  displayType: 'list',
  isTemplateListLoading: false,
  templateListSkeletonLoaders: DEFAULT_ITEMS_PER_PAGE,
  templateList: [],
  selectedTemplateList: [],
  isTemplateLoading: false,
  template: null,
  isDeleteInProgress: false,
  isSaveInProgress: false,
  isFileBeingAdded: false,
  isFileListLoading: false,
  fileList: [],
} as const;

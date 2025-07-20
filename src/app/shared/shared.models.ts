import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FileStorageType } from '@api/files/file-api.models';

export type FlexDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse' | '';
export type Display = 'flex' | 'inline-flex' | 'inline';
export type FlexAlignItems =
  | 'baseline'
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'self-end'
  | 'self-start'
  | 'stretch'
  | 'auto'
  | 'normal'
  | '';
export type FlexWrap = 'wrap' | 'wrap-reverse' | 'nowrap';
export type FlexJustifyContent =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | '';
export type GridDisplay = 'grid' | 'inline-grid';
export type GridJustifyItems =
  | 'anchor-center'
  | 'auto'
  | 'baseline'
  | 'center'
  | 'end'
  | 'flex-end'
  | 'flex-start'
  | 'left'
  | 'normal'
  | 'right'
  | 'self-end'
  | 'self-start'
  | 'start'
  | 'stretch'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'revert-layer'
  | 'unset';
export type GridJustifySelf = GridJustifyItems;
export type GridAlignItems = GridJustifyItems;
export type GridAlignSelf = GridJustifyItems;
export type CursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out';
export type Overflow = 'hidden' | 'visible' | 'clip' | 'scroll' | 'auto';
export type Option<T> = { value: T; viewValue: string };
export type DataViewDisplayType = 'list' | 'table';
export type TabLink = { link: string; title: string };
export type FileStorageTypeItem = { text: string; icon: string };
export type FormMode = 'new' | 'edit';
export type DictionaryItem = {
  name: string;
  code: string;
  value: string;
  description: string;
};

export type FileFormGroupArray = FormArray<FileFormGroup>;
export type FileFormGroup = FormGroup<FileForm>;
export type FileForm = {
  id: FormControl<number>;
  fileStorageType: FormControl<FileStorageType>;
  name: FormControl<string>;
  fileSize: FormControl<number>;
  isPublic: FormControl<boolean>;
  isActive: FormControl<boolean>;
  updated: FormControl<string>;
};

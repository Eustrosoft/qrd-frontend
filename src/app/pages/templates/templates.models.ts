import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FieldType } from '@api/templates/templates-api.models';
import { FileFormGroupArray } from '@shared/shared.models';

export type TemplateFormGroup = FormGroup<TemplateForm>;
export type TemplateForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  fields: TemplateFieldFormGroupArray;
  files: FileFormGroupArray;
};

export type TemplateFieldFormGroupArray = FormArray<TemplateFieldFormGroup>;
export type TemplateFieldFormGroup = FormGroup<TemplateFieldForm>;
export type TemplateFieldForm = {
  caption: FormControl<string>;
  fieldOrder: FormControl<number>;
  fieldType: FormControl<FieldType>;
  isPublic: FormControl<boolean>;
  isStatic: FormControl<boolean>;
  name: FormControl<string>;
  placeholder: FormControl<string>;
};

export type TemplateCreationFormGroup = FormGroup<TemplateCreationForm>;
export type TemplateCreationForm = {
  name: FormControl<string>;
  description: FormControl<string>;
};

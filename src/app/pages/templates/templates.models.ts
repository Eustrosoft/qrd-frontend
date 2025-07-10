import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FieldType } from '@api/templates/template-api.models';

export type TemplateFormGroup = FormGroup<TemplateForm>;
export type TemplateForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  fields: FormArray<TemplateFieldFormGroup>;
  files: FormArray<FormControl<string>>;
};

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

import { ResolveFn } from '@angular/router';
import { Actions, dispatch, ofActionCompleted, select } from '@ngxs/store';
import { FetchTemplate } from '@app/pages/templates/state/templates.actions';
import { inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import { TemplateFormFactoryService } from '@app/pages/templates/services/template-form-factory.service';
import { TemplateFormGroup } from '@app/pages/templates/templates.models';

export const templateFormResolver = (isNew = false): ResolveFn<Observable<TemplateFormGroup>> => {
  return (route, state) => {
    const actions$ = inject(Actions);
    const templateFormFactoryService = inject(TemplateFormFactoryService);

    if (isNew) {
      templateFormFactoryService.initialize();
      return of(templateFormFactoryService.form);
    }

    const templateId = route.paramMap.get('id')!;
    const template = select(TemplatesState.getTemplate$);

    if (template()) {
      templateFormFactoryService.initialize({
        name: template()?.name ?? '',
        description: template()?.description ?? '',
        fields: template()?.fields ?? [],
        files: template()?.files ?? [],
      });
      return of(templateFormFactoryService.form);
    }

    dispatch(FetchTemplate)(+templateId);
    return actions$.pipe(
      ofActionCompleted(FetchTemplate),
      map(() => {
        templateFormFactoryService.initialize({
          name: template()?.name ?? '',
          description: template()?.description ?? '',
          fields: template()?.fields ?? [],
          files: template()?.files ?? [],
        });
        return templateFormFactoryService.form;
      }),
    );
  };
};

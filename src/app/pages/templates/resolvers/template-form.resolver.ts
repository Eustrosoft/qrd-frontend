import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Actions, dispatch, ofActionErrored, ofActionSuccessful, select } from '@ngxs/store';
import { FetchTemplate } from '@app/pages/templates/state/templates.actions';
import { inject } from '@angular/core';
import { map, merge, Observable } from 'rxjs';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import { TemplateFormFactoryService } from '@app/pages/templates/services/template-form-factory.service';
import { TemplateFormGroup } from '@app/pages/templates/templates.models';
import { AppRoutes } from '@app/app.constants';

export const templateFormResolver = (): ResolveFn<Observable<TemplateFormGroup | RedirectCommand>> => {
  return (route) => {
    const actions$ = inject(Actions);
    const router = inject(Router);
    const templateFormFactoryService = inject(TemplateFormFactoryService);

    templateFormFactoryService.reset();

    const templateId = route.paramMap.get('id')!;
    const template = select(TemplatesState.getTemplate$);

    dispatch(FetchTemplate)(+templateId);
    return merge(
      actions$.pipe(
        ofActionSuccessful(FetchTemplate),
        map(() => {
          templateFormFactoryService.initialize({
            name: template()?.name ?? '',
            description: template()?.description ?? '',
            fields: template()?.fields ?? [],
            files: template()?.files ?? [],
          });
          return templateFormFactoryService.form;
        }),
      ),
      actions$.pipe(
        ofActionErrored(FetchTemplate),
        map(
          () =>
            new RedirectCommand(
              router.getCurrentNavigation()?.previousNavigation?.extractedUrl ??
                router.createUrlTree([AppRoutes.templates]),
            ),
        ),
      ),
    );
  };
};

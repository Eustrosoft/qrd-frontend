import { inject, Injectable } from '@angular/core';
import { Action, createSelector, State, StateContext, StateToken } from '@ngxs/store';
import { GetIcon } from '@shared/state/icon-registry.actions';
import { Icon, IconState, IconSvgParams } from '@app/app.models';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { patch } from '@ngxs/store/operators';

export interface IconRegistryStateModel {
  iconRecord: Partial<Record<string, IconState>>;
}

const defaults: IconRegistryStateModel = {
  iconRecord: {},
} as const;

const ICON_REGISTRY_STATE_TOKEN: StateToken<IconRegistryStateModel> = new StateToken<IconRegistryStateModel>(
  'iconRegistry',
);

@State<IconRegistryStateModel>({
  name: ICON_REGISTRY_STATE_TOKEN,
  defaults,
})
@Injectable()
export class IconRegistryState {
  private readonly http = inject(HttpClient);
  private readonly domSanitizer = inject(DomSanitizer);

  public static getIcon$(icon: Icon, params: IconSvgParams): (state: IconRegistryStateModel) => IconState {
    const iconKey = IconRegistryState.getIconKey(icon, params);
    return createSelector([IconRegistryState], (state: IconRegistryStateModel): IconState => {
      return (
        state.iconRecord[iconKey] ?? {
          iconSvg: null,
          isLoading: false,
          isLoadError: false,
        }
      );
    });
  }

  @Action(GetIcon)
  public getIcon(
    { getState, setState }: StateContext<IconRegistryStateModel>,
    { icon, params }: GetIcon,
  ): Observable<IconState> {
    const { iconRecord } = getState();
    const iconKey = IconRegistryState.getIconKey(icon, params);

    // Если значения есть - запрос не отправляем
    if (iconRecord[iconKey]?.iconSvg) {
      return of();
    }

    setState(
      patch({
        iconRecord: patch({
          [iconKey]: patch({
            iconSvg: null,
            isLoading: true,
            isLoadError: false,
          }),
        }),
      }),
    );

    return this.http.get(`/public/icons/${icon}.svg`, { responseType: 'text' }).pipe(
      map((rawSvg) => {
        const svg = this.processSvg(rawSvg, params);
        const iconState: IconState = {
          iconSvg: svg,
          isLoading: false,
          isLoadError: false,
        };
        setState(
          patch({
            iconRecord: patch({
              [iconKey]: patch(iconState),
            }),
          }),
        );
        return iconState;
      }),
      catchError(() => EMPTY),
    );
  }

  private static getIconKey(icon: Icon, params: IconSvgParams): string {
    return `${icon}-${params.width}-${params.height}`;
  }

  private processSvg(svg: string, params: IconSvgParams): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(
      svg
        .replace(/(<svg[^>]*\s)width="[^"]*"/g, `$1width="${params.width}"`)
        .replace(/(<svg[^>]*\s)height="[^"]*"/g, `$1height="${params.height}"`),
    );
  }
}

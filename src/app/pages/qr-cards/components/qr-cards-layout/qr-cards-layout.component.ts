import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import {
  DeleteQrCards,
  FetchQrCardList,
  SelectAllQrCards,
  SetQrCardListSearchValue,
  SetSelectedQrCards,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { SelectionBarComponent } from '@shared/components/selection-bar/selection-bar.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { AnimatedIfDirective } from '@shared/directives/animated-if.directive';
import { OverlayAnimationDirective } from '@shared/directives/overlay-animation.directive';
import { AppState } from '@app/state/app.state';
import { PatchSettings } from '@app/state/app.actions';
import { ColumnConfigOverlayComponent } from '@shared/components/column-config-overlay/column-config-overlay.component';
import { SharedLocalization } from '@shared/shared.constants';
import { RouterOutlet } from '@angular/router';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { OverlayContainerComponent } from '@shared/components/overlay-container/overlay-container.component';

@Component({
  selector: 'qr-cards-layout',
  imports: [
    DataViewComponent,
    SelectionBarComponent,
    MatIcon,
    MatMiniFabButton,
    UiSkeletonComponent,
    AnimatedIfDirective,
    OverlayAnimationDirective,
    ColumnConfigOverlayComponent,
    RouterOutlet,
    CdkOverlayOrigin,
    MatFabButton,
    OverlayContainerComponent,
  ],
  templateUrl: './qr-cards-layout.component.html',
  styleUrl: './qr-cards-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardsLayoutComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly document = inject(DOCUMENT);
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly SharedLocalization = SharedLocalization;

  protected readonly selectors = createSelectMap({
    searchValue: QrCardsState.getSearchValue$,
    settingsState: AppState.getSettingsState$,
    selectedQrCardList: QrCardsState.getSelectedQrCardList$,
    isDeleteInProgress: QrCardsState.isDeleteInProgress$,
    allQrCols: AppState.getAllQrCols$,
  });
  protected readonly actions = createDispatchMap({
    fetchQrCards: FetchQrCardList,
    setQrCardListSearchValue: SetQrCardListSearchValue,
    setSelectedQrCards: SetSelectedQrCards,
    selectAllQrCards: SelectAllQrCards,
    deleteQrCards: DeleteQrCards,
    patchSettings: PatchSettings,
  });

  protected openAdvancedSearch(): void {
    this.uiSidenavService.open(MatButton, {
      content: [[this.document.createTextNode(SharedLocalization.close)]],
      position: 'end',
      width: this.isSmallScreen() ? 'full' : 'sm',
    });
    const closeAction = (): void => {
      this.uiSidenavService.close();
      this.uiSidenavService.sidenavCmpRef()?.location.nativeElement.removeEventListener('click', closeAction);
    };
    this.uiSidenavService.sidenavCmpRef()?.location.nativeElement.addEventListener('click', closeAction);
  }
}

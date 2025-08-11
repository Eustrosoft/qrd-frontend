import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject } from '@angular/core';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import {
  DeleteQrCards,
  FetchQrCardList,
  SelectAllQrCards,
  SetQrCardsDataViewDisplayType,
  SetSelectedQrCards,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { SelectionBarComponent } from '@shared/components/selection-bar/selection-bar.component';
import { QrCardListComponent } from '@app/pages/qr-cards/components/qr-card-list/qr-card-list.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { AnimatedIfDirective } from '@shared/directives/animated-if.directive';
import { ViewModeSettingsComponent } from '@shared/components/view-mode-settings/view-mode-settings.component';
import { OverlayAnimationDirective } from '@shared/directives/overlay-animation.directive';
import { ALL_QR_TABLE_COLS } from '@app/app.constants';
import { AppState } from '@app/state/app.state';
import { PatchSettings } from '@app/state/app.actions';
import { ColumnConfigOverlayComponent } from '@shared/components/column-config-overlay/column-config-overlay.component';
import { SharedLocalization } from '@shared/shared.constants';

@Component({
  selector: 'qr-cards-layout',
  imports: [
    DataViewComponent,
    SelectionBarComponent,
    QrCardListComponent,
    MatIcon,
    MatMiniFabButton,
    UiSkeletonComponent,
    AnimatedIfDirective,
    ViewModeSettingsComponent,
    OverlayAnimationDirective,
    ColumnConfigOverlayComponent,
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

  protected readonly ALL_QR_TABLE_COLS = ALL_QR_TABLE_COLS;

  protected readonly selectors = createSelectMap({
    displayType: QrCardsState.getDisplayType$,
    settingsState: AppState.getSettingsState$,
    selectedQrCardList: QrCardsState.getSelectedQrCardList$,
    isDeleteInProgress: QrCardsState.isDeleteInProgress$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetQrCardsDataViewDisplayType,
    fetchQrCards: FetchQrCardList,
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

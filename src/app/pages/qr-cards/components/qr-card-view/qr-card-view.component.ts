import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  inputBinding,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppRoutes } from '@app/app.constants';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { MatButton } from '@angular/material/button';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import {
  DeleteQrCards,
  FetchGs1LabelList,
  FetchPCodeList,
  FetchQrCard,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { MatIcon } from '@angular/material/icon';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { TruncateDirective } from '@shared/directives/truncate.directive';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { QrViewComponent } from '@app/pages/qr-view/qr-view.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { Title } from '@angular/platform-browser';
import { MatMenuItem } from '@angular/material/menu';
import { MoreMenuComponent } from '@shared/components/more-menu/more-menu.component';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { UiAlertComponent } from '@ui/ui-alert/ui-alert.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { AppSelectors } from '@app/state/app.selectors';
import { QrCardsSelectors } from '@app/pages/qr-cards/state/qr-cards.selectors';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TabLink } from '@shared/shared.models';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'qr-card-view',
  imports: [
    RouterOutlet,
    MatButton,
    RouterLink,
    UiSkeletonComponent,
    MatIcon,
    InteractionEffect,
    TruncateDirective,
    ToHexPipe,
    ToolbarComponent,
    MatMenuItem,
    MoreMenuComponent,
    UiAlertComponent,
    UiFlexBlockComponent,
    MatTabLink,
    MatTabNavPanel,
    MatTabNav,
    RouterLinkActive,
  ],
  templateUrl: './qr-card-view.component.html',
  styleUrl: './qr-card-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardViewComponent implements OnInit {
  private readonly uiSidenavService = inject(UiSidenavService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly toHexPipe = inject(ToHexPipe);
  private readonly upperCasePipe = inject(UpperCasePipe);
  protected readonly qrCardsService = inject(QrCardsService);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly routeParams = toSignal(this.activatedRoute.params, { requireSync: true });

  protected readonly selectors = createSelectMap({
    configState: AppSelectors.getConfigState$,
    isQrCardLoading: QrCardsSelectors.getSlices.isQrCardLoading,
    isQrCardLoadErr: QrCardsSelectors.getSlices.isQrCardLoadErr,
    qrCard: QrCardsSelectors.getSlices.qrCard,
    qrCardPreviewUrl: QrCardsSelectors.getSlices.qrCardPreviewUrl,
    gs1LabelsState: QrCardsSelectors.getGs1LabelsState$,
    pCodesState: QrCardsSelectors.getPCodesState$,
    isDeleteInProgress: QrCardsSelectors.getSlices.isDeleteInProgress,
  });

  protected readonly actions = createDispatchMap({
    fetchQrCard: FetchQrCard,
    fetchGs1LabelList: FetchGs1LabelList,
    fetchPCodeList: FetchPCodeList,
    deleteQrCards: DeleteQrCards,
  });

  protected readonly qrCardCode = computed(() => this.toHexPipe.transform(this.selectors.qrCard()?.code));

  protected readonly titleEff = effect(() => {
    this.title.setTitle(
      `${SharedLocalization.defaultTitle} | ${RouteTitles.card} ${this.selectors.qrCard()?.name ?? ''}`,
    );
  });

  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.qrCard, title: this.upperCasePipe.transform(RouteTitles.card) },
    { link: AppRoutes.gs1, title: RouteTitles.gs1 },
    { link: AppRoutes.pins, title: RouteTitles.pins },
  ];

  protected readonly AppRoutes = AppRoutes;
  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;

  public ngOnInit(): void {
    this.actions.fetchQrCard(this.routeParams()['id'], this.routeParams()['code'], this.destroyRef);
    this.actions.fetchGs1LabelList(this.destroyRef, this.routeParams()['id']);
    this.actions.fetchPCodeList(this.routeParams()['id'], this.destroyRef);
  }

  protected openCardPreview(): void {
    this.uiSidenavService.open(QrViewComponent, {
      bindings: [inputBinding('iframeSrc', this.selectors.qrCardPreviewUrl)],
      position: 'end',
      width: this.isXSmall() ? 'full' : 'sm',
      isFixed: true,
    });
  }
}

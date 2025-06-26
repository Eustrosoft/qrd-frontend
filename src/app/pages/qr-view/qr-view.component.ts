import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { createSelectMap, dispatch, select } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { QrViewState } from '@app/pages/qr-view/state/qr-view.state';
import { FetchQR } from '@app/pages/qr-view/state/qr-view.actions';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { AttrListItemComponent } from '@shared/components/attr-list-item/attr-list-item.component';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { SharedLocalization } from '@shared/shared.constants';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { ErrorsLocalization } from '@modules/error/error.constants';

@Component({
  selector: 'qr-view',
  imports: [
    UiSkeletonComponent,
    AttrListItemComponent,
    CardContainerComponent,
    UiFlexBlockComponent,
    BytesToSizePipe,
    FileListItemComponent,
    BannerComponent,
  ],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrViewComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fetchQr = dispatch(FetchQR);
  protected readonly selectors = createSelectMap({
    qr: select(QrViewState.getQR$),
    isLoading: select(QrViewState.isLoading$),
    isLoadError: select(QrViewState.isLoadError$),
    errorText: select(QrViewState.getErrorText$),
  });
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;

  public ngOnInit(): void {
    this.fetchQr(this.activatedRoute.snapshot.queryParamMap.get('q') ?? '', this.destroyRef);
  }
}

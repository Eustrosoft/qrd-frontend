import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { FileStorageTypeMap, RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { createSelectMap } from '@ngxs/store';
import { BoolToTextPipe } from '@shared/pipe/bool-to-text.pipe';
import { DatePipe } from '@angular/common';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FilesSelectors } from '@app/pages/files/state/files.selectors';

@Component({
  selector: 'file-main',
  imports: [
    CardContainerComponent,
    CardFieldComponent,
    UiGridBlockComponent,
    BoolToTextPipe,
    DatePipe,
    FallbackPipe,
    InteractionEffect,
    MatButton,
    MatIcon,
  ],
  templateUrl: './file-main.component.html',
  styleUrl: './file-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileMainComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    file: FilesSelectors.getSlices.file,
  });

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly RouteTitles = RouteTitles;
  protected readonly FileStorageTypeMap = FileStorageTypeMap;

  protected readonly infoGridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly fileHref = computed<string>(() => {
    const file = this.selectors.file();
    if (!file?.id) {
      return '';
    }
    return `/qrCodeDemo/v1/api/secured/files/${file.id}/download/${encodeURIComponent(file.fileName)}`;
  });
}

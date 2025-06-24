import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FileStorageType } from '@api/qrs/file-api.models';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { SharedLocalization } from '@shared/shared.constants';
import { MatTooltip } from '@angular/material/tooltip';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';

@Component({
  selector: 'file-list-item',
  imports: [UiFlexBlockComponent, UiBadgeComponent, MatIcon, MatMiniFabButton, MatTooltip],
  templateUrl: './file-list-item.component.html',
  styleUrl: './file-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListItemComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly SharedLocalization = SharedLocalization;

  public readonly fileStorageType = input.required<FileStorageType>();
  public readonly name = input<string>('');
  public readonly fileSize = input<string | null>(null);
  public readonly isPublic = input<boolean>(false);
  public readonly isActive = input<boolean>(false);
  public readonly updated = input<string>('');
}

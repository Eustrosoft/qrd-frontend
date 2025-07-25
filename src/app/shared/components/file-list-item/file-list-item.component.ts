import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FileStorageType } from '@api/files/file-api.models';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { FileStorageTypeMap, SharedLocalization } from '@shared/shared.constants';
import { MatTooltip } from '@angular/material/tooltip';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'file-list-item',
  imports: [
    UiFlexBlockComponent,
    UiBadgeComponent,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    EllipsisDirective,
    RouterLink,
  ],
  templateUrl: './file-list-item.component.html',
  styleUrl: './file-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListItemComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly FileStorageTypeMap = FileStorageTypeMap;

  public readonly fileLink = input<string>('#');
  public readonly fileStorageType = input<FileStorageType | null>(null);
  public readonly name = input<string>('');
  public readonly fileSize = input<string | null>(null);
  public readonly isPublic = input<boolean | null>(null);
  public readonly isActive = input<boolean | null>(null);
  public readonly updated = input<string>('');
}

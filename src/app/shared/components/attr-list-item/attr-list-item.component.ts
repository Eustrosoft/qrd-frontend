import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { SharedLocalization } from '@shared/shared.constants';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FieldType } from '@api/templates/template-api.models';
import { DatePipe } from '@angular/common';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';

@Component({
  selector: 'attr-list-item',
  imports: [
    UiFlexBlockComponent,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    EllipsisDirective,
    DatePipe,
    InteractionEffect,
    MatButton,
  ],
  templateUrl: './attr-list-item.component.html',
  styleUrl: './attr-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttrListItemComponent {
  public readonly caption = input<string>('');
  public readonly value = input<string>('');
  public readonly type = input<FieldType>('TEXT');
  public readonly isPublic = input<boolean>(false);
  public readonly isStatic = input<boolean>(false);
  public readonly hideIconAttrs = input<boolean>(false);

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly isTextLike = computed<boolean>(() =>
    Array.from<FieldType>(['TEXT', 'NUMBER', 'URL', 'PHONE']).includes(this.type()),
  );
}

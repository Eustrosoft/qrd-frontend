import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Column } from '@api/settings/settings-api.models';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { QrRendererComponent } from '@shared/components/qr-renderer/qr-renderer.component';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';

@Component({
  selector: 'qr-table-cell',
  imports: [RouterLink, ToHexPipe, MatButton, QrRendererComponent, DatePipe, InteractionEffect, EllipsisDirective],
  templateUrl: './qr-table-cell.component.html',
  styleUrl: './qr-table-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrTableCellComponent {
  protected readonly activatedRoute = inject(ActivatedRoute);

  public readonly column = input.required<Column>();
  // eslint-disable-next-line
  public readonly value = input<any>('');

  protected readonly isTextLike = computed<boolean>(() =>
    Array.from<string>(['TEXT', 'NUMBER', 'URL', 'PHONE', 'EDIT']).includes(this.column().type),
  );
}

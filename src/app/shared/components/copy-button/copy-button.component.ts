import { ChangeDetectionStrategy, Component, HostListener, inject, input, viewChild } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTooltip } from '@angular/material/tooltip';
import { SharedLocalization } from '@shared/shared.constants';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'copy-button',
  imports: [MatTooltip, MatIconButton, MatIcon],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonComponent {
  private readonly clipboard = inject(Clipboard);

  public readonly copyValue = input<string>('');
  protected readonly tooltipTrigger = viewChild.required<MatTooltip>('tooltipTrigger');

  protected tooltipText = SharedLocalization.copy;

  protected readonly SharedLocalization = SharedLocalization;

  @HostListener('mouseenter')
  protected showTooltip(): void {
    this.tooltipTrigger().show();
  }

  @HostListener('mouseleave')
  protected hideTooltip(): void {
    this.tooltipTrigger().hide();
  }

  protected copyToClipboard(): void {
    if (this.clipboard.copy(this.copyValue())) {
      this.tooltipText = SharedLocalization.copied;
      const tooltip = this.tooltipTrigger();
      tooltip.show();
      timer(1000)
        .pipe(
          switchMap(() => {
            tooltip.hide();
            return timer(100).pipe(
              tap(() => {
                this.tooltipText = SharedLocalization.copy;
              }),
            );
          }),
        )
        .subscribe();
    }
  }
}

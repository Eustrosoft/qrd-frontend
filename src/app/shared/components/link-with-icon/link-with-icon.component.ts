import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TextInteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'link-with-icon',
  imports: [MatButton, MatIcon],
  templateUrl: './link-with-icon.component.html',
  styleUrl: './link-with-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [TextInteractionEffect],
})
export class LinkWithIconComponent implements OnInit {
  private readonly textInteractionEffect = inject(TextInteractionEffect, { host: true });

  public readonly icon = input<string>('open_in_new');

  public ngOnInit(): void {
    this.textInteractionEffect.targetSelectors.set(['a', 'mat-icon']);
  }
}

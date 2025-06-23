import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TextInteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, UrlTree } from '@angular/router';
import { ExternalLinkDirective } from '@shared/directives/external-link.directive';

@Component({
  selector: 'link-with-icon',
  imports: [MatButton, MatIcon],
  templateUrl: './link-with-icon.component.html',
  styleUrl: './link-with-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    TextInteractionEffect,
    { directive: ExternalLinkDirective, inputs: ['externalLink'] },
    { directive: RouterLink, inputs: ['routerLink:navigateTo'] },
  ],
})
export class LinkWithIconComponent implements OnInit {
  private readonly textInteractionEffect = inject(TextInteractionEffect, { host: true });

  public readonly icon = input<string>('open_in_new');
  public readonly navigateTo = input<string | UrlTree | null | undefined>('./');
  public readonly externalLink = input<string>('');

  public ngOnInit(): void {
    this.textInteractionEffect.targetSelectors.set(['a', 'mat-icon']);
  }
}

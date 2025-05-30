import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'auth-info-overlay',
  imports: [],
  templateUrl: './auth-info-overlay.component.html',
  styleUrl: './auth-info-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthInfoOverlayComponent {}

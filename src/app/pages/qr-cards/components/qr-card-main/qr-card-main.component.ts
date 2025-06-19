import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';

@Component({
  selector: 'qr-card-main',
  imports: [CardContainerComponent],
  templateUrl: './qr-card-main.component.html',
  styleUrl: './qr-card-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardMainComponent {}

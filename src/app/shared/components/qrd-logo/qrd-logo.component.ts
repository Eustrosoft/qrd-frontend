import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'qrd-logo',
  imports: [NgOptimizedImage, UiFlexBlockComponent],
  templateUrl: './qrd-logo.component.html',
  styleUrl: './qrd-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdLogoComponent {}

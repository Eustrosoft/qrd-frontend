import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'qrd-logo',
  imports: [FlexBlockComponent, NgOptimizedImage],
  templateUrl: './qrd-logo.component.html',
  styleUrl: './qrd-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdLogoComponent {}

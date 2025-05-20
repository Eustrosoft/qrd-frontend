import { MatDrawerMode } from '@angular/material/sidenav';
import { AutoFocusTarget } from '@angular/cdk/dialog';
import { BooleanInput } from '@angular/cdk/coercion';

export interface SidenavConfig {
  inputs: Record<string, unknown>;
  mode: MatDrawerMode;
  autoFocus: AutoFocusTarget | string | BooleanInput;
  position: 'start' | 'end';
  width: SidenavWidth;
  hasBackdrop: boolean;
  onSidenavClose: (() => void) | null;
  onBackdropClick: (() => void) | null;
}

/**
 * sm - 360px
 * md - 720px
 * lg - 1080px
 * full - 100%
 */
export type SidenavWidth = 'sm' | 'md' | 'lg' | 'full';

export type FlexDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse' | '';
export type Display = 'flex' | 'inline-flex' | 'inline';
export type FlexAlignItems = 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'self-end' | 'self-start' | 'stretch' | 'auto' | '';
export type FlexWrap = 'wrap' | 'wrap-reverse' | 'nowrap';
export type FlexJustifyContent = 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'space-evenly' | '';
export type GridDisplay = 'grid' | 'inline-grid';
export type GridJustifySelf = 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'left' | 'right';
export type CursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out';
export type VerticalAlign = 'middle';
export type Overflow = 'hidden' | 'visible' | 'clip' | 'scroll' | 'auto';
export type Option<T> = { value: T; viewValue: string };

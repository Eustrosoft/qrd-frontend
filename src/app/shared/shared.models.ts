export type FlexDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse' | '';
export type Display = 'flex' | 'inline-flex' | 'inline';
export type FlexAlignItems =
  | 'baseline'
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'self-end'
  | 'self-start'
  | 'stretch'
  | 'auto'
  | 'normal'
  | '';
export type FlexWrap = 'wrap' | 'wrap-reverse' | 'nowrap';
export type FlexJustifyContent =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | '';
export type GridDisplay = 'grid' | 'inline-grid';
export type GridJustifyItems =
  | 'anchor-center'
  | 'auto'
  | 'baseline'
  | 'center'
  | 'end'
  | 'flex-end'
  | 'flex-start'
  | 'left'
  | 'normal'
  | 'right'
  | 'self-end'
  | 'self-start'
  | 'start'
  | 'stretch'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'revert-layer'
  | 'unset';
export type GridJustifySelf = GridJustifyItems;
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
export type DataViewDisplayType = 'list' | 'table';

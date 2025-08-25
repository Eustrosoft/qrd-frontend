import { Binding, Injector, Type } from '@angular/core';

export interface BottomMenuConfig {
  bindings: Binding[];
  directives: (Type<unknown> | { type: Type<unknown>; bindings: Binding[] })[];
  content: Node[][];
  injector: Injector;
}

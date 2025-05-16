import { inject, InjectionToken, Renderer2, RendererFactory2 } from '@angular/core';

/*
 * Angular Renderer2 для использования в сервисах
 * В сервисах нам не доступен Renderer2, так как он выбрасывает null injector error.
 * В компонентах в нем нет необходимости, можно просто инжектировать Renderer2 напрямую
 */
export const RENDERER2: InjectionToken<Renderer2> = new InjectionToken('angular Renderer2', {
  factory: (): Renderer2 => {
    return inject(RendererFactory2).createRenderer(null, null);
  },
});

import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export function queryParamTitleResolverFactory(queryParam: string): ResolveFn<string> {
  return (route: ActivatedRouteSnapshot) => {
    return `QR №${route.queryParamMap.get(queryParam) ?? ''}`;
  };
}

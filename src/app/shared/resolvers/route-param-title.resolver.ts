import { ResolveFn } from '@angular/router';

export const routeParamTitleResolver = (
  prefix: string,
  paramName: string,
  paramTransformer: (param: string) => string = (param) => param,
): ResolveFn<string> => {
  return (route) => `${prefix} ${paramTransformer(`${route.paramMap.get(paramName) ?? ''}`)}`;
};

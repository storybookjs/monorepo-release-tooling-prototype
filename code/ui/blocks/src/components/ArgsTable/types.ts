import type { Conditional } from '@junk-temporary-prototypes/types';

// TODO ?
export interface JsDocParam {
  name: string;
  description?: string;
}

export interface JsDocParamDeprecated {
  deprecated?: string;
}

export interface JsDocReturns {
  description?: string;
}

export interface JsDocTags {
  params?: JsDocParam[];
  deprecated?: JsDocParamDeprecated;
  returns?: JsDocReturns;
}

export interface PropSummaryValue {
  summary: string;
  detail?: string;
  required?: boolean;
}

export type PropType = PropSummaryValue;
export type PropDefaultValue = PropSummaryValue;

export interface TableAnnotation {
  type: PropType;
  jsDocTags?: JsDocTags;
  defaultValue?: PropDefaultValue;
  category?: string;
}

export interface ArgType {
  name?: string;
  description?: string;
  defaultValue?: any;
  if?: Conditional;
  [key: string]: any;
}

export interface ArgTypes {
  [key: string]: ArgType;
}

export interface Args {
  [key: string]: any;
}

export type Globals = { [name: string]: any };

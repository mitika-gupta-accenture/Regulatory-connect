import { NavigationCondition } from "../hooks/useConditionEvaluator";

export interface IEventConfigJsonProps {
  event: string;
  eventHandler: string;
}

export interface ISectionJsonProps {
  name: string;
  component: string;
  layout?: string;
  displayOrder: number;
  children: IChildrenJsonProps[];
}

export interface IChildrenJsonProps {
  options?: ICompOptionProps[];
  name?: string;
  type?: string;
  text?: string;
  toolTip?: string;
  displayOrder: number;
  children?: INestedChildrenJsonProps[];
  apiDataIdKeys?: string[];
  disabled?: boolean;
  visible?: boolean;
  value?: string;
  columns?: string[][];
  rows?: string[][];
  showDateTime?: boolean;
  apiDataId?: string;
  layout?: string;
  visibilityCondition?: NavigationCondition<Record<string, any>>;
  required?: boolean;
  errorMessage?: string;
  inputNames?:
    | {
        month: any;
        year: any;
        day: any;
      }
    | any;
  addMoreParent?: string;
  addMoreIndex?: number;
}

export interface INestedChildrenJsonProps {
  type?: string;
  text?: string;
  fromAddMore?: boolean;
  apiDataId?: string;
  visibilityCondition?: NavigationCondition<Record<string, any>>;
  name?: string;
  toolTip?: string;
  displayOrder?: number;
  children?: INestedChildrenJsonProps[];
  apiDataIdKeys?: string[];
  disabled?: boolean;
  visible?: boolean;
  value?: string;
  linkData?: {
    link?: string;
    linkText?: string;
  };
  events?: IEventConfigJsonProps[];
  required?: boolean;
  errorMessage?: string;
  inputNames?:
    | {
        month: any;
        year: any;
        day: any;
      }
    | any;
  addMoreParent?: string;
  addMoreIndex?: number;
}

export interface IPageJsonProps {
  staticRoute?: boolean;
  name: string;
  btnText?:string;
  showSubmitButton?: boolean;
  backToDashboard?: boolean;
  backToDashboardHref?: any;
  backToDashboardText?: any;
  navigationCondition?: Record<string, any> | string;
  specialFlowCondition?: Record<string, any> | any;
  showCancelButton?: boolean;
  component?: string;
  events?: IEventConfigJsonProps[];
  sections?: ISectionJsonProps[];
  layout?: string;
}

export interface IServiceParametersJsonProps {
  component: string;
  children: IChildrenJsonProps[];
}

export interface IJsonProps {
  serviceParameters: IServiceParametersJsonProps[];
  routes: string[];
  pages: IPageJsonProps[];
}

export interface ICompOptionProps {
  disabled?: boolean;
  title?: string;
  value?: string;
  children?: IChildrenJsonProps[];
  visibilityCondition?: NavigationCondition<Record<string, any>>;
}

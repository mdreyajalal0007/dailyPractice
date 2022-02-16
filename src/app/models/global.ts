import { ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export interface IHitApi {
  url: string;
  requestMethod: RequestMethod;
  input: object;
  ignoreToken?: boolean;
  ignoreBaseUrl?: boolean;
  response: Function;
  errorFunction?: Function;
  endFunction?: Function;
  hideResponseMsg?: boolean;
  hideLoader?: boolean;
}

export interface IFormGenerator {
  formName: string;
  fields: IFormField[];
}

export interface IFormField {
  fieldName: string;
  value?: string;
  fieldType: FieldTypes;
  validations?: ValidatorFn[];
  placeholder: string;
}

export enum FieldTypes {
  TEXT = 'text',
  PASSWORD = 'password',
  NUMBER = 'number',
}

export enum RequestMethod {
  GET,
  POST,
  PUT,
  DELETE,
}

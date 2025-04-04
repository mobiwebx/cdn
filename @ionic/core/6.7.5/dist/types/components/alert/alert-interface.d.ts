import type { AnimationBuilder, Mode, TextFieldTypes } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';
export interface AlertOptions {
  header?: string;
  subHeader?: string;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  inputs?: AlertInput[];
  buttons?: (AlertButton | string)[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  animated?: boolean;
  htmlAttributes?: AlertAttributes;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
/**
 * @deprecated - Use { [key: string]: any } directly instead.
 */
export declare type AlertAttributes = {
  [key: string]: any;
};
export interface AlertInput {
  type?: TextFieldTypes | 'checkbox' | 'radio' | 'textarea';
  name?: string;
  placeholder?: string;
  value?: any;
  /**
   * The label text to display next to the input, if the input type is `radio` or `checkbox`.
   */
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  handler?: (input: AlertInput) => void;
  min?: string | number;
  max?: string | number;
  cssClass?: string | string[];
  attributes?: AlertInputAttributes | AlertTextareaAttributes;
  tabindex?: number;
}
/**
 * @deprecated - Use { [key: string]: any } directly instead.
 */
export declare type AlertTextareaAttributes = {
  [key: string]: any;
};
/**
 * @deprecated - Use { [key: string]: any } directly instead.
 */
export declare type AlertInputAttributes = {
  [key: string]: any;
};
declare type AlertButtonOverlayHandler = boolean | void | {
  [key: string]: any;
};
export interface AlertButton {
  text: string;
  role?: 'cancel' | 'destructive' | string;
  cssClass?: string | string[];
  id?: string;
  handler?: (value: any) => AlertButtonOverlayHandler | Promise<AlertButtonOverlayHandler>;
}
export {};

import type { AnimationBuilder, Color, Mode } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';
export interface ToastOptions {
  header?: string;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  duration?: number;
  buttons?: (ToastButton | string)[];
  position?: 'top' | 'bottom' | 'middle';
  translucent?: boolean;
  animated?: boolean;
  icon?: string;
  htmlAttributes?: ToastAttributes;
  layout?: ToastLayout;
  color?: Color;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
/**
 * @deprecated - Use { [key: string]: any } directly instead.
 */
export declare type ToastAttributes = {
  [key: string]: any;
};
export declare type ToastLayout = 'baseline' | 'stacked';
export interface ToastButton {
  text?: string;
  icon?: string;
  side?: 'start' | 'end';
  role?: 'cancel' | string;
  cssClass?: string | string[];
  handler?: () => boolean | void | Promise<boolean | void>;
}
export declare type ToastPosition = 'top' | 'bottom' | 'middle';

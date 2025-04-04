import type { AnimationBuilder, Mode } from '../../interface';
export interface PickerOptions {
  columns: PickerColumn[];
  buttons?: PickerButton[];
  cssClass?: string | string[];
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  animated?: boolean;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: PickerAttributes;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
/**
 * @deprecated - Use { [key: string]: any } directly instead.
 */
export declare type PickerAttributes = {
  [key: string]: any;
};
export interface PickerButton {
  text?: string;
  role?: string;
  cssClass?: string | string[];
  handler?: (value: any) => boolean | void;
}
export interface PickerColumn {
  name: string;
  align?: string;
  selectedIndex?: number;
  prevSelected?: number;
  prefix?: string;
  suffix?: string;
  options: PickerColumnOption[];
  cssClass?: string | string[];
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
  /**
   * @deprecated - Use the `columns` property on `ion-picker`
   * to refresh the component view instead.
   */
  refresh?: () => void;
}
export interface PickerColumnOption {
  text?: string;
  value?: any;
  disabled?: boolean;
  duration?: number;
  transform?: string;
  selected?: boolean;
  /**
   * The optional text to assign as the aria-label on the picker column option.
   */
  ariaLabel?: string;
}

import type { ComponentInterface, EventEmitter } from '../../stencil-public-runtime';
import type { AnimationBuilder, Color, OverlayEventDetail, OverlayInterface, ToastButton } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';
import type { ToastAttributes, ToastPosition, ToastLayout } from './toast-interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part button - Any button element that is displayed inside of the toast.
 * @part container - The element that wraps all child elements.
 * @part header - The header text of the toast.
 * @part message - The body text of the toast.
 * @part icon - The icon that appears next to the toast content.
 */
export declare class Toast implements ComponentInterface, OverlayInterface {
  private customHTMLEnabled;
  private durationTimeout?;
  presented: boolean;
  el: HTMLIonToastElement;
  /**
   * @internal
   */
  overlayIndex: number;
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  color?: Color;
  /**
   * Animation to use when the toast is presented.
   */
  enterAnimation?: AnimationBuilder;
  /**
   * Animation to use when the toast is dismissed.
   */
  leaveAnimation?: AnimationBuilder;
  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  cssClass?: string | string[];
  /**
   * How many milliseconds to wait before hiding the toast. By default, it will show
   * until `dismiss()` is called.
   */
  duration: number;
  /**
   * Header to be shown in the toast.
   */
  header?: string;
  /**
   * Defines how the message and buttons are laid out in the toast.
   * 'baseline': The message and the buttons will appear on the same line.
   * Message text may wrap within the message container.
   * 'stacked': The buttons containers and message will stack on top
   * of each other. Use this if you have long text in your buttons.
   */
  layout: ToastLayout;
  /**
   * Message to be shown in the toast.
   * This property accepts custom HTML as a string.
   * Developers who only want to pass plain text
   * can disable the custom HTML functionality
   * by setting `innerHTMLTemplatesEnabled: false` in the Ionic config.
   */
  message?: string | IonicSafeString;
  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  keyboardClose: boolean;
  /**
   * The position of the toast on the screen.
   */
  position: ToastPosition;
  /**
   * An array of buttons for the toast.
   */
  buttons?: (ToastButton | string)[];
  /**
   * If `true`, the toast will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  translucent: boolean;
  /**
   * If `true`, the toast will animate.
   */
  animated: boolean;
  /**
   * The name of the icon to display, or the path to a valid SVG file. See `ion-icon`.
   * https://ionic.io/ionicons
   */
  icon?: string;
  /**
   * Additional attributes to pass to the toast.
   */
  htmlAttributes?: ToastAttributes;
  /**
   * Emitted after the toast has presented.
   */
  didPresent: EventEmitter<void>;
  /**
   * Emitted before the toast has presented.
   */
  willPresent: EventEmitter<void>;
  /**
   * Emitted before the toast has dismissed.
   */
  willDismiss: EventEmitter<OverlayEventDetail>;
  /**
   * Emitted after the toast has dismissed.
   */
  didDismiss: EventEmitter<OverlayEventDetail>;
  connectedCallback(): void;
  /**
   * Present the toast overlay after it has been created.
   */
  present(): Promise<void>;
  /**
   * Dismiss the toast overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the toast.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the toast.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  dismiss(data?: any, role?: string): Promise<boolean>;
  /**
   * Returns a promise that resolves when the toast did dismiss.
   */
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>>;
  /**
   * Returns a promise that resolves when the toast will dismiss.
   */
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>>;
  private getButtons;
  private buttonClick;
  private callButtonHandler;
  private dispatchCancelHandler;
  renderButtons(buttons: ToastButton[], side: 'start' | 'end'): any;
  private renderToastMessage;
  render(): any;
}

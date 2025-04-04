import type { ComponentInterface, EventEmitter } from '../../stencil-public-runtime';
import type { Animation, AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, ModalAttributes, ModalBreakpointChangeEventDetail, ModalHandleBehavior, OverlayEventDetail, OverlayInterface } from '../../interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed inside of the `.modal-content` element.
 *
 * @part backdrop - The `ion-backdrop` element.
 * @part content - The wrapper element for the default slot.
 * @part handle - The handle that is displayed at the top of the sheet modal when `handle="true"`.
 */
export declare class Modal implements ComponentInterface, OverlayInterface {
  private gesture?;
  private modalIndex;
  private modalId?;
  private coreDelegate;
  private currentTransition?;
  private sheetTransition?;
  private destroyTriggerInteraction?;
  private isSheetModal;
  private currentBreakpoint?;
  private wrapperEl?;
  private backdropEl?;
  private sortedBreakpoints?;
  private keyboardOpenCallback?;
  private moveSheetToBreakpoint?;
  private inheritedAttributes;
  private statusBarStyle?;
  private inline;
  private workingDelegate?;
  private usersElement?;
  private gestureAnimationDismissing;
  lastFocus?: HTMLElement;
  animation?: Animation;
  presented: boolean;
  el: HTMLIonModalElement;
  /** @internal */
  hasController: boolean;
  /** @internal */
  overlayIndex: number;
  /** @internal */
  delegate?: FrameworkDelegate;
  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  keyboardClose: boolean;
  /**
   * Animation to use when the modal is presented.
   */
  enterAnimation?: AnimationBuilder;
  /**
   * Animation to use when the modal is dismissed.
   */
  leaveAnimation?: AnimationBuilder;
  /**
   * The breakpoints to use when creating a sheet modal. Each value in the
   * array must be a decimal between 0 and 1 where 0 indicates the modal is fully
   * closed and 1 indicates the modal is fully open. Values are relative
   * to the height of the modal, not the height of the screen. One of the values in this
   * array must be the value of the `initialBreakpoint` property.
   * For example: [0, .25, .5, 1]
   */
  breakpoints?: number[];
  /**
   * A decimal value between 0 and 1 that indicates the
   * initial point the modal will open at when creating a
   * sheet modal. This value must also be listed in the
   * `breakpoints` array.
   */
  initialBreakpoint?: number;
  /**
   * A decimal value between 0 and 1 that indicates the
   * point after which the backdrop will begin to fade in
   * when using a sheet modal. Prior to this point, the
   * backdrop will be hidden and the content underneath
   * the sheet can be interacted with. This value is exclusive
   * meaning the backdrop will become active after the value
   * specified.
   */
  backdropBreakpoint: number;
  /**
   * The horizontal line that displays at the top of a sheet modal. It is `true` by default when
   * setting the `breakpoints` and `initialBreakpoint` properties.
   */
  handle?: boolean;
  /**
   * The interaction behavior for the sheet modal when the handle is pressed.
   *
   * Defaults to `"none"`, which  means the modal will not change size or position when the handle is pressed.
   * Set to `"cycle"` to let the modal cycle between available breakpoints when pressed.
   *
   * Handle behavior is unavailable when the `handle` property is set to `false` or
   * when the `breakpoints` property is not set (using a fullscreen or card modal).
   */
  handleBehavior?: ModalHandleBehavior;
  /**
   * The component to display inside of the modal.
   * @internal
   */
  component?: ComponentRef;
  /**
   * The data to pass to the modal component.
   * @internal
   */
  componentProps?: ComponentProps;
  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   * @internal
   */
  cssClass?: string | string[];
  /**
   * If `true`, the modal will be dismissed when the backdrop is clicked.
   */
  backdropDismiss: boolean;
  /**
   * If `true`, a backdrop will be displayed behind the modal.
   * This property controls whether or not the backdrop
   * darkens the screen when the modal is presented.
   * It does not control whether or not the backdrop
   * is active or present in the DOM.
   */
  showBackdrop: boolean;
  /**
   * If `true`, the modal will animate.
   */
  animated: boolean;
  /**
   * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
   * @deprecated - To prevent modals from dismissing, use canDismiss instead.
   */
  swipeToClose: boolean;
  /**
   * The element that presented the modal. This is used for card presentation effects
   * and for stacking multiple modals on top of each other. Only applies in iOS mode.
   */
  presentingElement?: HTMLElement;
  /**
   * Additional attributes to pass to the modal.
   */
  htmlAttributes?: ModalAttributes;
  /**
   * If `true`, the modal will open. If `false`, the modal will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the modalController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the modal dismisses. You will need to do that in your code.
   */
  isOpen: boolean;
  onIsOpenChange(newValue: boolean, oldValue: boolean): void;
  /**
   * An ID corresponding to the trigger element that
   * causes the modal to open when clicked.
   */
  trigger: string | undefined;
  onTriggerChange(): void;
  /**
   * If `true`, the component passed into `ion-modal` will
   * automatically be mounted when the modal is created. The
   * component will remain mounted even when the modal is dismissed.
   * However, the component will be destroyed when the modal is
   * destroyed. This property is not reactive and should only be
   * used when initially creating a modal.
   *
   * Note: This feature only applies to inline modals in JavaScript
   * frameworks such as Angular, React, and Vue.
   */
  keepContentsMounted: boolean;
  /**
   * TODO (FW-937)
   * This needs to default to true in the next
   * major release. We default it to undefined
   * so we can force the card modal to be swipeable
   * when using canDismiss.
   */
  /**
   * Determines whether or not a modal can dismiss
   * when calling the `dismiss` method.
   *
   * If the value is `true` or the value's function returns `true`, the modal will close when trying to dismiss.
   * If the value is `false` or the value's function returns `false`, the modal will not close when trying to dismiss.
   */
  canDismiss?: undefined | boolean | ((data?: any, role?: string) => Promise<boolean>);
  /**
   * Emitted after the modal has presented.
   */
  didPresent: EventEmitter<void>;
  /**
   * Emitted before the modal has presented.
   */
  willPresent: EventEmitter<void>;
  /**
   * Emitted before the modal has dismissed.
   */
  willDismiss: EventEmitter<OverlayEventDetail>;
  /**
   * Emitted after the modal has dismissed.
   */
  didDismiss: EventEmitter<OverlayEventDetail>;
  /**
   * Emitted after the modal breakpoint has changed.
   */
  ionBreakpointDidChange: EventEmitter<ModalBreakpointChangeEventDetail>;
  /**
   * Emitted after the modal has presented.
   * Shorthand for ionModalDidPresent.
   */
  didPresentShorthand: EventEmitter<void>;
  /**
   * Emitted before the modal has presented.
   * Shorthand for ionModalWillPresent.
   */
  willPresentShorthand: EventEmitter<void>;
  /**
   * Emitted before the modal has dismissed.
   * Shorthand for ionModalWillDismiss.
   */
  willDismissShorthand: EventEmitter<OverlayEventDetail>;
  /**
   * Emitted after the modal has dismissed.
   * Shorthand for ionModalDidDismiss.
   */
  didDismissShorthand: EventEmitter<OverlayEventDetail>;
  swipeToCloseChanged(enable: boolean): Promise<void>;
  breakpointsChanged(breakpoints: number[] | undefined): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  componentWillLoad(): void;
  componentDidLoad(): void;
  private configureTriggerInteraction;
  /**
   * Determines whether or not an overlay
   * is being used inline or via a controller/JS
   * and returns the correct delegate.
   * By default, subsequent calls to getDelegate
   * will use a cached version of the delegate.
   * This is useful for calling dismiss after
   * present so that the correct delegate is given.
   */
  private getDelegate;
  /**
   * Determines whether or not the
   * modal is allowed to dismiss based
   * on the state of the canDismiss prop.
   */
  private checkCanDismiss;
  /**
   * Present the modal overlay after it has been created.
   */
  present(): Promise<void>;
  private initSwipeToClose;
  private initSheetGesture;
  private sheetOnDismiss;
  /**
   * Dismiss the modal overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
   */
  dismiss(data?: any, role?: string): Promise<boolean>;
  /**
   * Returns a promise that resolves when the modal did dismiss.
   */
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>>;
  /**
   * Returns a promise that resolves when the modal will dismiss.
   */
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>>;
  /**
   * Move a sheet style modal to a specific breakpoint. The breakpoint value must
   * be a value defined in your `breakpoints` array.
   */
  setCurrentBreakpoint(breakpoint: number): Promise<void>;
  /**
   * Returns the current breakpoint of a sheet style modal
   */
  getCurrentBreakpoint(): Promise<number | undefined>;
  private moveToNextBreakpoint;
  private onHandleClick;
  private onBackdropTap;
  private onLifecycle;
  render(): any;
}

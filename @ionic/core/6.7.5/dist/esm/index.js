/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
export { c as createAnimation } from './animation-4ff3f603.js';
export { iosTransitionAnimation } from './ios.transition-4a0deed6.js';
export { mdTransitionAnimation } from './md.transition-0d261204.js';
export { g as getTimeGivenProgression } from './cubic-bezier-e78d1307.js';
export { createGesture } from './index-422b6e83.js';
export { g as getPlatforms, i as initialize, a as isPlatform } from './ionic-global-c74e4951.js';
import { a as addEventListener, r as raf, b as removeEventListener } from './helpers-3b390e48.js';
export { c as componentOnReady } from './helpers-3b390e48.js';
export { I as IonicSafeString, g as getMode, s as setupConfig } from './config-d4f612d2.js';
export { a as LIFECYCLE_DID_ENTER, c as LIFECYCLE_DID_LEAVE, L as LIFECYCLE_WILL_ENTER, b as LIFECYCLE_WILL_LEAVE, d as LIFECYCLE_WILL_UNLOAD } from './index-27c7e5c4.js';
export { m as menuController } from './index-2b839939.js';
export { b as actionSheetController, a as alertController, l as loadingController, m as modalController, p as pickerController, c as popoverController, t as toastController } from './overlays-58fa8e4d.js';
import './index-33ffec25.js';
import './gesture-controller-17060b7c.js';
import './index-8e692445.js';
import './hardware-back-button-490df115.js';

/**
 * This is a plugin for Swiper that allows it to work
 * with Ionic Framework and the routing integrations.
 * Without this plugin, Swiper would be incapable of correctly
 * determining the dimensions of the slides component as
 * each view is initially hidden before transitioning in.
 */
const setupSwiperInIonic = (swiper, watchForIonPageChanges = true) => {
  if (typeof window === 'undefined') {
    return;
  }
  const swiperEl = swiper.el;
  const ionPage = swiperEl.closest('.ion-page');
  if (!ionPage) {
    if (watchForIonPageChanges) {
      /**
       * If no ion page found, it is possible
       * that we are in the overlay setup step
       * where the inner component has been
       * created but not attached to the DOM yet.
       * If so, wait for the .ion-page class to
       * appear on the root div and re-run setup.
       */
      const rootNode = swiperEl.getRootNode();
      if (rootNode.tagName === 'DIV') {
        const mo = new MutationObserver((m) => {
          const mutation = m[0];
          const wasEmpty = mutation.oldValue === null;
          const hasIonPage = rootNode.classList.contains('ion-page');
          /**
           * Now that we have an .ion-page class
           * we can safely attempt setup again.
           */
          if (wasEmpty && hasIonPage) {
            mo.disconnect();
            /**
             * Set false here so we do not
             * get infinite loops
             */
            setupSwiperInIonic(swiper, false);
          }
        });
        mo.observe(rootNode, {
          attributeFilter: ['class'],
          attributeOldValue: true,
        });
      }
    }
    return;
  }
  /**
   * If using slides in a modal or
   * popover we need to wait for the
   * overlay to be shown as these components
   * are hidden when they are initially created.
   */
  const modalOrPopover = swiperEl.closest('ion-modal, ion-popover');
  if (modalOrPopover) {
    const eventName = modalOrPopover.tagName === 'ION-MODAL' ? 'ionModalWillPresent' : 'ionPopoverWillPresent';
    const overlayCallback = () => {
      /**
       * We need an raf here so the update
       * is fired one tick after the overlay is shown.
       */
      raf(() => {
        swiperEl.swiper.update();
        removeEventListener(modalOrPopover, eventName, overlayCallback);
      });
    };
    addEventListener(modalOrPopover, eventName, overlayCallback);
  }
  else {
    /**
     * If using slides in a page
     * we need to wait for the ion-page-invisible
     * class to be removed so Swiper can correctly
     * compute the dimensions of the slides.
     */
    const mo = new MutationObserver((m) => {
      var _a;
      const mutation = m[0];
      const wasPageHidden = (_a = mutation.oldValue) === null || _a === void 0 ? void 0 : _a.includes('ion-page-invisible');
      const isPageHidden = ionPage.classList.contains('ion-page-invisible');
      /**
       * Only update Swiper if the page was
       * hidden but is no longer hidden.
       */
      if (!isPageHidden && isPageHidden !== wasPageHidden) {
        swiperEl.swiper.update();
      }
    });
    mo.observe(ionPage, {
      attributeFilter: ['class'],
      attributeOldValue: true,
    });
  }
  /**
   * We also need to listen for the appload event
   * which is emitted by Stencil in the
   * event that Swiper is being used on the
   * view that is rendered initially.
   */
  const onAppLoad = () => {
    swiperEl.swiper.update();
    removeEventListener(window, 'appload', onAppLoad);
  };
  addEventListener(window, 'appload', onAppLoad);
};
const IonicSwiper = {
  name: 'ionic',
  on: {
    afterInit(swiper) {
      console.warn('[Deprecation Warning]: The IonicSwiper module has been deprecated in favor of the IonSlides module. This change was made to better support the Swiper 7 release. The IonicSwiper module will be removed in Ionic 7.0. See https://ionicframework.com/docs/api/slides#migration for revised migration steps.');
      setupSwiperInIonic(swiper);
    },
  },
};

const IonicSlides = (opts) => {
  const { swiper, extendParams } = opts;
  const slidesParams = {
    effect: undefined,
    direction: 'horizontal',
    initialSlide: 0,
    loop: false,
    parallax: false,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 300,
    slidesPerColumn: 1,
    slidesPerColumnFill: 'column',
    slidesPerGroup: 1,
    centeredSlides: false,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    touchEventsTarget: 'container',
    freeMode: false,
    freeModeMomentum: true,
    freeModeMomentumRatio: 1,
    freeModeMomentumBounce: true,
    freeModeMomentumBounceRatio: 1,
    freeModeMomentumVelocityRatio: 1,
    freeModeSticky: false,
    freeModeMinimumVelocity: 0.02,
    autoHeight: false,
    setWrapperSize: false,
    zoom: {
      maxRatio: 3,
      minRatio: 1,
      toggle: false,
    },
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    touchStartPreventDefault: false,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    threshold: 0,
    touchMoveStopPropagation: true,
    touchReleaseOnEdges: false,
    iOSEdgeSwipeDetection: false,
    iOSEdgeSwipeThreshold: 20,
    resistance: true,
    resistanceRatio: 0.85,
    watchSlidesProgress: false,
    watchSlidesVisibility: false,
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,
    loopAdditionalSlides: 0,
    noSwiping: true,
    runCallbacksOnInit: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    flipEffect: {
      slideShadows: true,
      limitRotation: true,
    },
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    fadeEffect: {
      crossFade: false,
    },
    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
    },
  };
  if (swiper.pagination) {
    slidesParams.pagination = {
      type: 'bullets',
      clickable: false,
      hideOnClick: false,
    };
  }
  if (swiper.scrollbar) {
    slidesParams.scrollbar = {
      hide: true,
    };
  }
  extendParams(slidesParams);
};

export { IonicSlides, IonicSwiper };

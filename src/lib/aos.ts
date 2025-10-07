import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  PLATFORM_ID,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import type { Styles, Threshold, Easing } from '../types/Inputs';

import { CssAnimationService } from './cssAnimation';

/**
 * Animate element when user scrolls it into view
 */
@Directive({
  selector: '[ng-aos]',
  standalone: true,
})
export class NgAosDirective implements OnDestroy, OnInit {
  /**
   * Styles to apply when the element is hidden.
   */
  @Input('hide') hideStyles: Styles = {};

  /**
   * Styles to apply when the element becomes visible.
   */
  @Input('show') showStyles: Styles = {};

  /**
   * Duration of the show animation in milliseconds.
   */
  @Input() duration: number = 500;

  /**
   * Delay before the show animation starts, in milliseconds.
   */
  @Input() delay: number = 0;

  /**
   * CSS easing function for the show animation.
   * Controls the acceleration curve of the transition.
   */
  @Input() easing: Easing = '';

  /**
   * Percentage of the element that must be visible before triggering the animation.
   */
  @Input() threshold: Threshold = 0.6;

  /**
   * Margin around the root element used by IntersectionObserver.
   * Example usage:
   *  - '0px'    → triggers exactly when the element enters the viewport
   *  - '100px'  → triggers 100px before the element enters
   *  - '-50px'  → triggers after the element is 50px inside the viewport
   */
  @Input() rootMargin: `${number}px` = '0px';

  /**
   * Optional CSS class that handles animation.
   * If set, then the CSS is responsible for hiding/showing the element,
   * not the directive
   */
  @Input() aosClass: string = '';

  /**
   * Emits an event when the element enters the viewport.
   */
  @Output() intersection = new EventEmitter<ElementRef>();

  // Indicates whether the code is running in the browser (used for SSR safety)
  private _isBrowser: boolean;
  // Css class used to animate element
  private _animationClass: string = '';
  // Intersection observer instance
  private _observer!: IntersectionObserver;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
    private _css: CssAnimationService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    this._isBrowser = isPlatformBrowser(this._platformId);
  }

  ngOnInit() {
    if (this._isBrowser) {
      this._animationClass =
        this.aosClass ||
        this._css.createRandomAnimationClass(
          this.hideStyles,
          this.showStyles,
          this.duration,
          this.delay,
          this.easing
        );

      this._setHideStyles();
      this._createObserver();
      this._startObserving();
    }
  }

  private _setHideStyles() {
    if (this.aosClass) {
      return;
    }
    for (const style of Object.keys(this.hideStyles)) {
      this._renderer.setStyle(
        this._element.nativeElement,
        style,
        this.hideStyles[style as keyof CSSStyleDeclaration]
      );
    }
  }

  private _createObserver() {
    const options = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    this._observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= this.threshold) {
          this._handleIntersection();
        }
      });
    }, options);
  }

  private _startObserving() {
    this._observer?.observe(this._element.nativeElement);
  }

  private _handleIntersection() {
    const target = this._element.nativeElement;
    this._renderer.addClass(target, this._animationClass);
    this.intersection.emit(this._element.nativeElement);
    this._observer?.unobserve(target);
  }

  ngOnDestroy() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }
}

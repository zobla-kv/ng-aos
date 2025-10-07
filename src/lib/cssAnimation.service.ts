import { Injectable } from '@angular/core';
import type { Styles, Easing } from '../types/Inputs';

@Injectable({ providedIn: 'root' })
export class CssAnimationService {
  private _styleElement: HTMLStyleElement | null = null;
  private _cache = new Map<string, string>(); // hash -> className

  constructor() {
    if (typeof document !== 'undefined') {
      this._styleElement = document.createElement('style');
      this._styleElement.setAttribute('data-css-animation', '');
      document.head.appendChild(this._styleElement);
    }
  }

  /**
   * Generate a random CSS class with animation
   * and append to document head
   */
  createRandomAnimationClass(
    hideStyles: Styles = { opacity: '0' },
    showStyles: Styles = { opacity: '1' },
    duration: number = 500,
    delay: number = 0,
    easing: Easing = ''
  ): string {
    if (!this._styleElement) {
      throw new Error(
        '<style data-css-animation> not appended to document <head>'
      );
    }

    const hash = this._generateHash({
      hideStyles,
      showStyles,
      duration,
      delay,
      easing,
    });

    const existingClass = this._cache.get(hash);
    if (existingClass) {
      return existingClass;
    }

    const className = `anim_${Math.random().toString(36).substring(2, 9)}`;
    const keyframesName = `kf_${Math.random().toString(36).substring(2, 9)}`;

    const hideCss = this._objToString(hideStyles);
    const showCss = this._objToString(showStyles);

    const css = `
      @keyframes ${keyframesName} {
        0% { ${hideCss} }
        100% { ${showCss} }
      }

      .${className} {
        animation-name: ${keyframesName};
        animation-duration: ${duration}ms;
        animation-delay: ${delay}ms;
        animation-timing-function: ${easing || 'linear'};
        animation-fill-mode: forwards;
      }
    `;

    this._styleElement.appendChild(document.createTextNode(css));
    this._cache.set(hash, className);

    return className;
  }

  /**
   * Transform Object to string
   */
  private _objToString(styles: Styles): string {
    return Object.entries(styles)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ');
  }

  /**
   * Stringify but sorted
   * Will produce same string no matter the order of keys in obj
   */
  private _sortedStringify(obj: Object): string {
    if (obj === null || typeof obj !== 'object') return String(obj);
    if (Array.isArray(obj))
      return `[${obj.map((v) => this._sortedStringify(v)).join(',')}]`;

    const keys = Object.keys(obj).sort();
    return `{${keys
      .map((k) => `${k}:${this._sortedStringify(obj[k as keyof Object])}`)
      .join(',')}}`;
  }

  /**
   * Hash generator
   */
  private _generateHash(obj: Object): string {
    const str = this._sortedStringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `h${Math.abs(hash).toString(36)}`;
  }
}

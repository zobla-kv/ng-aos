import { Injectable } from '@angular/core';
import type { Styles, Easing } from '../types/Inputs';

@Injectable({ providedIn: 'root' })
export class CssAnimationService {
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
    const className = `anim_${Math.random().toString(36).substring(2, 9)}`;
    const keyframesName = `kf_${Math.random().toString(36).substring(2, 9)}`;

    const hideCss = Object.entries(hideStyles)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ');
    const showCss = Object.entries(showStyles)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ');

    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
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

    document.head.appendChild(styleEl);

    return className;
  }
}

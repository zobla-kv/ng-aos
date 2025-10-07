# ng-aos

> **Animate element when user scrolls it into view.** ![Demo of global services provider](https://github.com/zobla-kv/ng-aos/blob/master/assets/ng-aos-demo.gif?raw=true)

---

## 📖 Description

**ng-aos** provides a simple way to detect when elements enter the viewport in Angular applications, allowing you to run animations or trigger other actions.

---

## 💪 Features

- Compatible with Angular v20
- Works **only** with standalone components (NgModules are not supported)
- Can animate elements or just detect visibility
- Fully customizable
- Fully typed
- SSR compatible

---

## ⚙️ Prerequisites

- **Angular**: `^17.0.0` or higher
- **TypeScript** (recommended): for full type safety

---

## 📦 Installation

```bash
npm install ng-aos
# or
yarn add ng-aos
```

---

## 🧩 How to use

##### 1. Setup

```tsx
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgAos } from 'ng-aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgAos],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
```

<br />

##### 2. Usage

###### a. Directive controlled animation

```tsx
// src/app/app.component.html
<div
  ng-aos
  [hide]="{ opacity: '0', transform: 'translateY(40px)' }"
  [show]="{ opacity: '1', transform: 'translateY(0px)' }"
>
  Animated element
</div>
```

<br />

**Inputs Table**

| Input        | Type                                                       | Description                                                                     | Default |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------- | ------- |
| `hide`       | `Partial<CSSStyleDeclaration>`                             | Styles to apply when the element is hidden.                                     | `{}`    |
| `show`       | `Partial<CSSStyleDeclaration>`                             | Styles to apply when the element becomes visible.                               | `{}`    |
| `duration`   | `number`                                                   | Duration of the show animation in milliseconds.                                 | `500`   |
| `delay`      | `number`                                                   | Delay before the show animation starts, in milliseconds.                        | `0`     |
| `easing`     | `'' \| 'ease' \| 'ease-in' \| 'ease-out' \| 'ease-in-out'` | CSS easing function for the show animation.                                     | `''`    |
| `threshold`  | `number between 0 and 1`                                   | Percentage of the element that must be visible before triggering the animation. | `0.6`   |
| `rootMargin` | `${number}px`                                              | Margin around the target element used by the observer.                          | `'0px'` |
| `aosClass`   | `string`                                                   | If set, CSS becomes responsible for handling animations (see option b.)         | `''`    |

<br />

**Outputs table**

| Input          | Type                       | Description                                          |
| -------------- | -------------------------- | ---------------------------------------------------- |
| `intersection` | `EventEmitter<ElementRef>` | Emits an event when the element enters the viewport. |

<br />

###### b. CSS controlled animation

Activated by providing `aosClass` input to the directive. When it is present, all other inputs are ignored and CSS becomes responsible for hiding/showing the element.

```tsx
// src/app/app.component.html
<div class="element" ng-aos aosClass='slide-up'>
  Animated element
</div>

// src/app/app.component.css
 .element {
    width: 100%;

    // reverse 'slide-up' styles
    transition: 1s;
    transform: translateY(40px);
    opacity: 0;
  }
  .slide-up {
    transform: translateY(0px);
    opacity: 1;
  }
```

<br />

###### c. Trigger an action without animation

By ommiting all inputs to the directive, and handling only output, it is possible to handle use case when you don't need animation, but rather want to do something when element enters the viewport.

```tsx
// src/app/app.component.html
<div ng-aos (intersection)="onIntersect($event)">Animated element</div>

// src/app/app.component.ts
onIntersect(el: ElementRef) {
  // call API
  // Or send event to google analytics
  // ...
}
```

---

### Enjoy! 🎉

---

/*
 * Copyright (c) 2010-2020 SAP and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   SAP - initial API and implementation
 */
// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {appendStyle} from './utils/append-style.js';
import {XElement} from './XElement.js';

/**
 * @extends {XElement}
 */
export class XWidget extends XElement {
  constructor() {
    super();
    this.style.setProperty('display', 'flex');
    this.style.setProperty('flex-direction', 'column');
    this.style.setProperty('align-items', 'stretch');
    this.style.setProperty('justify-content', 'flex-start');
    this.style.setProperty('contain', 'layout style');

    this._visible = false;
    /** @type {?DocumentFragment} */
    this._shadowRoot;
    /** @type {?Element} */
    this._defaultFocusedElement = null;
    /** @type {!Array<!Element>} */
    this._elementsToRestoreScrollPositionsFor = [];
    /** @type {?function()} */
    this._onShownCallback;
    /** @type {?function()} */
    this._onHiddenCallback;
    /** @type {?function()} */
    this._onResizedCallback;

    if (!XWidget._observer) {
      XWidget._observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target._visible && entry.target._onResizedCallback) {
            entry.target._onResizedCallback.call(null);
          }
        }
      });
    }
    XWidget._observer.observe(this);

    this.setElementsToRestoreScrollPositionsFor([this]);
  }

  /**
   * @param {?Node} node
   */
  static focusWidgetForNode(node) {
    node = node && node.parentNodeOrShadowHost();
    let widget = null;
    while (node) {
      if (node instanceof XWidget) {
        if (widget) {
          node._defaultFocusedElement = widget;
        }
        widget = node;
      }
      node = node.parentNodeOrShadowHost();
    }
  }

  /**
   * @return {boolean}
   */
  isShowing() {
    return this._visible;
  }

  /**
   * @param {string} cssFile
   */
  registerRequiredCSS(cssFile) {
    appendStyle(this._shadowRoot || this, cssFile);
  }

  /**
   * @param {?function()} callback
   */
  setOnShown(callback) {
    this._onShownCallback = callback;
  }

  /**
   * @param {?function()} callback
   */
  setOnHidden(callback) {
    this._onHiddenCallback = callback;
  }

  /**
   * @param {?function()} callback
   */
  setOnResized(callback) {
    this._onResizedCallback = callback;
  }

  /**
   * @param {!Array<!Element>} elements
   */
  setElementsToRestoreScrollPositionsFor(elements) {
    for (const element of this._elementsToRestoreScrollPositionsFor) {
      element.removeEventListener('scroll', XWidget._storeScrollPosition, {passive: true, capture: false});
    }
    this._elementsToRestoreScrollPositionsFor = elements;
    for (const element of this._elementsToRestoreScrollPositionsFor) {
      element.addEventListener('scroll', XWidget._storeScrollPosition, {passive: true, capture: false});
    }
  }

  restoreScrollPositions() {
    for (const element of this._elementsToRestoreScrollPositionsFor) {
      if (element._scrollTop) {
        element.scrollTop = element._scrollTop;
      }
      if (element._scrollLeft) {
        element.scrollLeft = element._scrollLeft;
      }
    }
  }

  /**
   * @param {!Event} event
   */
  static _storeScrollPosition(event) {
    const element = event.currentTarget;
    element._scrollTop = element.scrollTop;
    element._scrollLeft = element.scrollLeft;
  }

  /**
   * @param {?Element} element
   */
  setDefaultFocusedElement(element) {
    if (element && !this.isSelfOrAncestor(element)) {
      throw new Error('Default focus must be descendant');
    }
    this._defaultFocusedElement = element;
  }

  /**
   * @override
   */
  focus() {
    if (!this._visible) {
      return;
    }

    let element;
    if (this._defaultFocusedElement && this.isSelfOrAncestor(this._defaultFocusedElement)) {
      element = this._defaultFocusedElement;
    } else if (this.tabIndex !== -1) {
      element = this;
    } else {
      let child = this.traverseNextNode(this);
      while (child) {
        if ((child instanceof XWidget) && child._visible) {
          element = child;
          break;
        }
        child = child.traverseNextNode(this);
      }
    }

    if (!element || element.hasFocus()) {
      return;
    }
    if (element === this) {
      HTMLElement.prototype.focus.call(this);
    } else {
      element.focus();
    }
  }

  /**
   * @override
   */
  connectedCallback() {
    this._visible = true;
    this.restoreScrollPositions();
    if (this._onShownCallback) {
      this._onShownCallback.call(null);
    }
  }

  /**
   * @override
   */
  disconnectedCallback() {
    this._visible = false;
    if (this._onHiddenCallback) {
      this._onHiddenCallback.call(null);
    }
  }
}

self.customElements.define('x-widget', XWidget);

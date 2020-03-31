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
// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as UI from '../ui/ui.js';

/**
 * @unrestricted
 */
export class InspectedPagePlaceholder extends UI.Widget.Widget {
  constructor() {
    super(true);
    this.registerRequiredCSS('emulation/inspectedPagePlaceholder.css');
    UI.ZoomManager.ZoomManager.instance().addEventListener(UI.ZoomManager.Events.ZoomChanged, this.onResize, this);
    this.restoreMinimumSize();
  }

  /**
   * @override
   */
  onResize() {
    if (this._updateId) {
      this.element.window().cancelAnimationFrame(this._updateId);
    }
    this._updateId = this.element.window().requestAnimationFrame(this.update.bind(this, false));
  }

  restoreMinimumSize() {
    this.setMinimumSize(150, 150);
  }

  clearMinimumSize() {
    this.setMinimumSize(1, 1);
  }

  _dipPageRect() {
    const zoomFactor = UI.ZoomManager.ZoomManager.instance().zoomFactor();
    const rect = this.element.getBoundingClientRect();
    const bodyRect = this.element.ownerDocument.body.getBoundingClientRect();

    const left = Math.max(rect.left * zoomFactor, bodyRect.left * zoomFactor);
    const top = Math.max(rect.top * zoomFactor, bodyRect.top * zoomFactor);
    const bottom = Math.min(rect.bottom * zoomFactor, bodyRect.bottom * zoomFactor);
    const right = Math.min(rect.right * zoomFactor, bodyRect.right * zoomFactor);

    return {x: left, y: top, width: right - left, height: bottom - top};
  }

  /**
   * @param {boolean=} force
   */
  update(force) {
    delete this._updateId;
    const rect = this._dipPageRect();
    const bounds = {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      height: Math.max(1, Math.round(rect.height)),
      width: Math.max(1, Math.round(rect.width)),
    };
    if (force) {
      // Short term fix for Lighthouse interop.
      --bounds.height;
      this.dispatchEventToListeners(Events.Update, bounds);
      ++bounds.height;
    }
    this.dispatchEventToListeners(Events.Update, bounds);
  }
}

/**
 * @return {!InspectedPagePlaceholder}
 */
export const instance = function() {
  return self.singleton(InspectedPagePlaceholder);
};

/** @enum {symbol} */
export const Events = {
  Update: Symbol('Update')
};

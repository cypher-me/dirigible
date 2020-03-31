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

import * as Common from '../common/common.js';
import * as QuickOpen from '../quick_open/quick_open.js';
import * as Workspace from '../workspace/workspace.js';  // eslint-disable-line no-unused-vars

import {evaluateScriptSnippet} from './ScriptSnippetFileSystem.js';

export class SnippetsQuickOpen extends QuickOpen.FilteredListWidget.Provider {
  constructor() {
    super();
    /** @type {!Array<!Workspace.UISourceCode.UISourceCode>} */
    this._snippets = [];
  }
  /**
   * @override
   * @param {?number} itemIndex
   * @param {string} promptValue
   */
  selectItem(itemIndex, promptValue) {
    if (itemIndex === null) {
      return;
    }
    evaluateScriptSnippet(this._snippets[itemIndex]);
  }

  /**
   * @override
   * @param {string} query
   * @return {string}
   */
  notFoundText(query) {
    return Common.UIString.UIString('No snippets found.');
  }

  /**
   * @override
   */
  attach() {
    this._snippets = Snippets.project.uiSourceCodes();
  }

  /**
   * @override
   */
  detach() {
    this._snippets = [];
  }


  /**
   * @override
   * @return {number}
   */
  itemCount() {
    return this._snippets.length;
  }

  /**
   * @override
   * @param {number} itemIndex
   * @return {string}
   */
  itemKeyAt(itemIndex) {
    return this._snippets[itemIndex].name();
  }

  /**
   * @override
   * @param {number} itemIndex
   * @param {string} query
   * @param {!Element} titleElement
   * @param {!Element} subtitleElement
   */
  renderItem(itemIndex, query, titleElement, subtitleElement) {
    titleElement.textContent = unescape(this._snippets[itemIndex].name());
    titleElement.classList.add('monospace');
    QuickOpen.FilteredListWidget.FilteredListWidget.highlightRanges(titleElement, query, true);
  }
}
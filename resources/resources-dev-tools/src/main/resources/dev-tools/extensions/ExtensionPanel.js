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
import * as ProtocolClient from '../protocol_client/protocol_client.js';  // eslint-disable-line no-unused-vars
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';

import {ExtensionServer} from './ExtensionServer.js';  // eslint-disable-line no-unused-vars
import {ExtensionNotifierView, ExtensionView} from './ExtensionView.js';

/**
 * @implements {UI.SearchableView.Searchable}
 * @unrestricted
 */
export class ExtensionPanel extends UI.Panel.Panel {
  /**
   * @param {!ExtensionServer} server
   * @param {string} panelName
   * @param {string} id
   * @param {string} pageURL
   */
  constructor(server, panelName, id, pageURL) {
    super(panelName);
    this._server = server;
    this._id = id;
    this.setHideOnDetach();
    this._panelToolbar = new UI.Toolbar.Toolbar('hidden', this.element);

    this._searchableView = new UI.SearchableView.SearchableView(this);
    this._searchableView.show(this.element);

    const extensionView = new ExtensionView(server, this._id, pageURL, 'extension');
    extensionView.show(this._searchableView.element);
  }

  /**
   * @param {!UI.Toolbar.ToolbarItem} item
   */
  addToolbarItem(item) {
    this._panelToolbar.element.classList.remove('hidden');
    this._panelToolbar.appendToolbarItem(item);
  }

  /**
   * @override
   */
  searchCanceled() {
    this._server.notifySearchAction(this._id, Extensions.extensionAPI.panels.SearchAction.CancelSearch);
    this._searchableView.updateSearchMatchesCount(0);
  }

  /**
   * @override
   * @return {!UI.SearchableView.SearchableView}
   */
  searchableView() {
    return this._searchableView;
  }

  /**
   * @override
   * @param {!UI.SearchableView.SearchConfig} searchConfig
   * @param {boolean} shouldJump
   * @param {boolean=} jumpBackwards
   */
  performSearch(searchConfig, shouldJump, jumpBackwards) {
    const query = searchConfig.query;
    this._server.notifySearchAction(this._id, Extensions.extensionAPI.panels.SearchAction.PerformSearch, query);
  }

  /**
   * @override
   */
  jumpToNextSearchResult() {
    this._server.notifySearchAction(this._id, Extensions.extensionAPI.panels.SearchAction.NextSearchResult);
  }

  /**
   * @override
   */
  jumpToPreviousSearchResult() {
    this._server.notifySearchAction(this._id, Extensions.extensionAPI.panels.SearchAction.PreviousSearchResult);
  }

  /**
   * @override
   * @return {boolean}
   */
  supportsCaseSensitiveSearch() {
    return false;
  }

  /**
   * @override
   * @return {boolean}
   */
  supportsRegexSearch() {
    return false;
  }
}

/**
 * @unrestricted
 */
export class ExtensionButton {
  /**
   * @param {!ExtensionServer} server
   * @param {string} id
   * @param {string} iconURL
   * @param {string=} tooltip
   * @param {boolean=} disabled
   */
  constructor(server, id, iconURL, tooltip, disabled) {
    this._id = id;

    this._toolbarButton = new UI.Toolbar.ToolbarButton('', '');
    this._toolbarButton.addEventListener(
        UI.Toolbar.ToolbarButton.Events.Click, server.notifyButtonClicked.bind(server, this._id));
    this.update(iconURL, tooltip, disabled);
  }

  /**
   * @param {string} iconURL
   * @param {string=} tooltip
   * @param {boolean=} disabled
   */
  update(iconURL, tooltip, disabled) {
    if (typeof iconURL === 'string') {
      this._toolbarButton.setBackgroundImage(iconURL);
    }
    if (typeof tooltip === 'string') {
      this._toolbarButton.setTitle(tooltip);
    }
    if (typeof disabled === 'boolean') {
      this._toolbarButton.setEnabled(!disabled);
    }
  }

  /**
   * @return {!UI.Toolbar.ToolbarButton}
   */
  toolbarButton() {
    return this._toolbarButton;
  }
}

/**
 * @unrestricted
 */
export class ExtensionSidebarPane extends UI.View.SimpleView {
  /**
   * @param {!ExtensionServer} server
   * @param {string} panelName
   * @param {string} title
   * @param {string} id
   */
  constructor(server, panelName, title, id) {
    super(title);
    this.element.classList.add('fill');
    this._panelName = panelName;
    this._server = server;
    this._id = id;
  }

  /**
   * @return {string}
   */
  id() {
    return this._id;
  }

  /**
   * @return {string}
   */
  panelName() {
    return this._panelName;
  }

  /**
   * @param {!Object} object
   * @param {string} title
   * @param {function(?string=)} callback
   */
  setObject(object, title, callback) {
    this._createObjectPropertiesView();
    this._setObject(SDK.RemoteObject.RemoteObject.fromLocalObject(object), title, callback);
  }

  /**
   * @param {string} expression
   * @param {string} title
   * @param {!Object} evaluateOptions
   * @param {string} securityOrigin
   * @param {function(?string=)} callback
   */
  setExpression(expression, title, evaluateOptions, securityOrigin, callback) {
    this._createObjectPropertiesView();
    this._server.evaluate(
        expression, true, false, evaluateOptions, securityOrigin, this._onEvaluate.bind(this, title, callback));
  }

  /**
   * @param {string} url
   */
  setPage(url) {
    if (this._objectPropertiesView) {
      this._objectPropertiesView.detach();
      delete this._objectPropertiesView;
    }
    if (this._extensionView) {
      this._extensionView.detach(true);
    }

    this._extensionView = new ExtensionView(this._server, this._id, url, 'extension fill');
    this._extensionView.show(this.element);

    if (!this.element.style.height) {
      this.setHeight('150px');
    }
  }

  /**
   * @param {string} height
   */
  setHeight(height) {
    this.element.style.height = height;
  }

  /**
   * @param {string} title
   * @param {function(?string=)} callback
   * @param {?ProtocolClient.InspectorBackend.ProtocolError} error
   * @param {?SDK.RemoteObject.RemoteObject} result
   * @param {boolean=} wasThrown
   */
  _onEvaluate(title, callback, error, result, wasThrown) {
    if (error || !result) {
      callback(error.toString());
    } else {
      this._setObject(result, title, callback);
    }
  }

  _createObjectPropertiesView() {
    if (this._objectPropertiesView) {
      return;
    }
    if (this._extensionView) {
      this._extensionView.detach(true);
      delete this._extensionView;
    }
    this._objectPropertiesView = new ExtensionNotifierView(this._server, this._id);
    this._objectPropertiesView.show(this.element);
  }

  /**
   * @param {!SDK.RemoteObject.RemoteObject} object
   * @param {string} title
   * @param {function(?string=)} callback
   */
  _setObject(object, title, callback) {
    // This may only happen if setPage() was called while we were evaluating the expression.
    if (!this._objectPropertiesView) {
      callback('operation cancelled');
      return;
    }
    this._objectPropertiesView.element.removeChildren();
    UI.UIUtils.Renderer.render(object, {title, editable: false}).then(result => {
      if (!result) {
        callback();
        return;
      }
      if (result.tree && result.tree.firstChild()) {
        result.tree.firstChild().expand();
      }
      this._objectPropertiesView.element.appendChild(result.node);
      callback();
    });
  }
}

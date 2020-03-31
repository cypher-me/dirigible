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
import * as Common from '../common/common.js';
import * as ProtocolClient from '../protocol_client/protocol_client.js';
import * as TextUtils from '../text_utils/text_utils.js';

import {Events, NetworkRequest} from './NetworkRequest.js';                   // eslint-disable-line no-unused-vars
import {ResourceTreeFrame, ResourceTreeModel} from './ResourceTreeModel.js';  // eslint-disable-line no-unused-vars

/**
 * @implements {TextUtils.ContentProvider.ContentProvider}
 * @unrestricted
 */
export class Resource {
  /**
   * @param {!ResourceTreeModel} resourceTreeModel
   * @param {?NetworkRequest} request
   * @param {string} url
   * @param {string} documentURL
   * @param {!Protocol.Page.FrameId} frameId
   * @param {!Protocol.Network.LoaderId} loaderId
   * @param {!Common.ResourceType.ResourceType} type
   * @param {string} mimeType
   * @param {?Date} lastModified
   * @param {?number} contentSize
   */
  constructor(
      resourceTreeModel, request, url, documentURL, frameId, loaderId, type, mimeType, lastModified, contentSize) {
    this._resourceTreeModel = resourceTreeModel;
    this._request = request;
    this.url = url;
    this._documentURL = documentURL;
    this._frameId = frameId;
    this._loaderId = loaderId;
    this._type = type || Common.ResourceType.resourceTypes.Other;
    this._mimeType = mimeType;

    this._lastModified = lastModified && lastModified.isValid() ? lastModified : null;
    this._contentSize = contentSize;

    /** @type {?string} */ this._content;
    /** @type {?string} */ this._contentLoadError;
    /** @type {boolean} */ this._contentEncoded;
    this._pendingContentCallbacks = [];
    if (this._request && !this._request.finished) {
      this._request.addEventListener(Events.FinishedLoading, this._requestFinished, this);
    }
  }

  /**
   * @return {?Date}
   */
  lastModified() {
    if (this._lastModified || !this._request) {
      return this._lastModified;
    }
    const lastModifiedHeader = this._request.responseLastModified();
    const date = lastModifiedHeader ? new Date(lastModifiedHeader) : null;
    this._lastModified = date && date.isValid() ? date : null;
    return this._lastModified;
  }

  /**
   * @return {?number}
   */
  contentSize() {
    if (typeof this._contentSize === 'number' || !this._request) {
      return this._contentSize;
    }
    return this._request.resourceSize;
  }

  /**
   * @return {?NetworkRequest}
   */
  get request() {
    return this._request;
  }

  /**
   * @return {string}
   */
  get url() {
    return this._url;
  }

  /**
   * @param {string} x
   */
  set url(x) {
    this._url = x;
    this._parsedURL = new Common.ParsedURL.ParsedURL(x);
  }

  get parsedURL() {
    return this._parsedURL;
  }

  /**
   * @return {string}
   */
  get documentURL() {
    return this._documentURL;
  }

  /**
   * @return {!Protocol.Page.FrameId}
   */
  get frameId() {
    return this._frameId;
  }

  /**
   * @return {!Protocol.Network.LoaderId}
   */
  get loaderId() {
    return this._loaderId;
  }

  /**
   * @return {string}
   */
  get displayName() {
    return this._parsedURL.displayName;
  }

  /**
   * @return {!Common.ResourceType.ResourceType}
   */
  resourceType() {
    return this._request ? this._request.resourceType() : this._type;
  }

  /**
   * @return {string}
   */
  get mimeType() {
    return this._request ? this._request.mimeType : this._mimeType;
  }

  /**
   * @return {?string}
   */
  get content() {
    return this._content;
  }

  /**
   * @override
   * @return {string}
   */
  contentURL() {
    return this._url;
  }

  /**
   * @override
   * @return {!Common.ResourceType.ResourceType}
   */
  contentType() {
    if (this.resourceType() === Common.ResourceType.resourceTypes.Document &&
        this.mimeType.indexOf('javascript') !== -1) {
      return Common.ResourceType.resourceTypes.Script;
    }
    return this.resourceType();
  }

  /**
   * @override
   * @return {!Promise<boolean>}
   */
  async contentEncoded() {
    await this.requestContent();
    return this._contentEncoded;
  }

  /**
   * @override
   * @return {!Promise<!TextUtils.ContentProvider.DeferredContent>}
   */
  requestContent() {
    if (typeof this._content !== 'undefined') {
      return Promise.resolve({content: /** @type {string} */ (this._content), isEncoded: this._contentEncoded});
    }

    let callback;
    const promise = new Promise(fulfill => callback = fulfill);
    this._pendingContentCallbacks.push(callback);
    if (!this._request || this._request.finished) {
      this._innerRequestContent();
    }
    return promise;
  }

  /**
   * @return {string}
   */
  canonicalMimeType() {
    return this.contentType().canonicalMimeType() || this.mimeType;
  }

  /**
   * @override
   * @param {string} query
   * @param {boolean} caseSensitive
   * @param {boolean} isRegex
   * @return {!Promise<!Array<!TextUtils.ContentProvider.SearchMatch>>}
   */
  async searchInContent(query, caseSensitive, isRegex) {
    if (!this.frameId) {
      return [];
    }
    if (this.request) {
      return this.request.searchInContent(query, caseSensitive, isRegex);
    }
    const result = await this._resourceTreeModel.target().pageAgent().searchInResource(
        this.frameId, this.url, query, caseSensitive, isRegex);
    return result || [];
  }

  /**
   * @param {!Element} image
   */
  async populateImageSource(image) {
    const {content} = await this.requestContent();
    const encoded = this._contentEncoded;
    image.src = TextUtils.ContentProvider.contentAsDataURL(content, this._mimeType, encoded) || this._url;
  }

  _requestFinished() {
    this._request.removeEventListener(Events.FinishedLoading, this._requestFinished, this);
    if (this._pendingContentCallbacks.length) {
      this._innerRequestContent();
    }
  }

  async _innerRequestContent() {
    if (this._contentRequested) {
      return;
    }
    this._contentRequested = true;

    /** @type {!TextUtils.ContentProvider.DeferredContent} */
    let loadResult;
    if (this.request) {
      const contentData = await this.request.contentData();
      this._content = contentData.content;
      this._contentEncoded = contentData.encoded;
      loadResult = {content: /** @type{string} */ (contentData.content), isEncoded: contentData.encoded};
    } else {
      const response = await this._resourceTreeModel.target().pageAgent().invoke_getResourceContent(
          {frameId: this.frameId, url: this.url});
      if (response[ProtocolClient.InspectorBackend.ProtocolError]) {
        this._contentLoadError = response[ProtocolClient.InspectorBackend.ProtocolError];
        this._content = null;
        loadResult = {error: response[ProtocolClient.InspectorBackend.ProtocolError], isEncoded: false};
      } else {
        this._content = response.content;
        this._contentLoadError = null;
        loadResult = {content: response.content, isEncoded: response.base64Encoded};
      }
      this._contentEncoded = response.base64Encoded;
    }

    if (this._content === null) {
      this._contentEncoded = false;
    }

    for (const callback of this._pendingContentCallbacks.splice(0)) {
      callback(loadResult);
    }

    delete this._contentRequested;
  }

  /**
   * @return {boolean}
   */
  hasTextContent() {
    if (this._type.isTextType()) {
      return true;
    }
    if (this._type === Common.ResourceType.resourceTypes.Other) {
      return !!this._content && !this._contentEncoded;
    }
    return false;
  }

  /**
   * @return {!ResourceTreeFrame}
   */
  frame() {
    return this._resourceTreeModel.frameForId(this._frameId);
  }
}
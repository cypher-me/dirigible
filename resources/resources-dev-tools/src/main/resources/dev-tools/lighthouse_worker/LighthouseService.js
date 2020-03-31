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
// Copyright (c) 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @interface
 */
// eslint-disable-next-line
const LighthousePort = class {
  /**
   * @param {!string} eventName, 'message', 'close'
   * @param {function(string|undefined)} cb
   */
  on(eventName, cb) {
  }

  /**
   * @param {string} message
   */
  send(message) {
  }

  close() {
  }
};

/**
 * @implements {LighthousePort}
 * @implements {Service}
 * @unrestricted
 */
class LighthouseService {  // eslint-disable-line
  /**
   * @override
   * @param {function(string)}
   */
  setNotify(notify) {
    this._notify = notify;
  }

  /**
   * @return {!Promise<!ReportRenderer.RunnerResult>}
   */
  start(params) {
    if (Root.Runtime.queryParam('isUnderTest')) {
      this._disableLoggingForTest();
      params.flags.maxWaitForLoad = 2 * 1000;
    }

    self.listenForStatus(message => {
      this.statusUpdate(message[1]);
    });

    return Promise.resolve()
        .then(_ => self.runLighthouseInWorker(this, params.url, params.flags, params.categoryIDs))
        .then(/** @type {!ReportRenderer.RunnerResult} */ result => {
          // Keep all artifacts on the result, no trimming
          return result;
        })
        .catch(err => ({
                 fatal: true,
                 message: err.message,
                 stack: err.stack,
               }));
  }

  /**
   * @return {!Promise}
   */
  stop() {
    this.close();
    return Promise.resolve();
  }

  /**
   * @param {!Object=} params
   * @return {!Promise}
   */
  dispatchProtocolMessage(params) {
    this._onMessage(params['message']);
    return Promise.resolve();
  }

  /**
   * @override
   * @return {!Promise}
   */
  dispose() {
    return Promise.resolve();
  }

  /**
   * @param {string} message
   */
  statusUpdate(message) {
    this._notify('statusUpdate', {message: message});
  }

  /**
   * @param {string} message
   */
  send(message) {
    this._notify('sendProtocolMessage', {message: message});
  }

  close() {
  }

  /**
   * @param {string} eventName
   * @param {function(string|undefined)} cb
   */
  on(eventName, cb) {
    if (eventName === 'message') {
      this._onMessage = cb;
    }
    if (eventName === 'close') {
      this._onClose = cb;
    }
  }

  _disableLoggingForTest() {
    console.log = () => undefined;  // eslint-disable-line no-console
  }
}

// Make lighthouse and traceviewer happy.
global = self;
global.isVinn = true;
global.document = {};
global.document.documentElement = {};
global.document.documentElement.style = {
  WebkitAppearance: 'WebkitAppearance'
};
global.LighthouseService = LighthouseService;

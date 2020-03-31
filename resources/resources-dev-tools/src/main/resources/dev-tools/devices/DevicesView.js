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
// Copyright 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

Devices.DevicesView = class extends UI.VBox {
  constructor() {
    super(true);

    const deprecationMessage = this.contentElement.createChild('span');
    const documentationLink = UI.html
    `<a class="devtools-link" role="link" tabindex="0" href="#" style="display: inline; cursor: pointer;">chrome://inspect/#devices</a>`;

    self.onInvokeElement(documentationLink, event => {
      SDK.SDKModel.TargetManager.instance().mainTarget().pageAgent().navigate('chrome://inspect/#devices');
      event.consume(true);
    });

    deprecationMessage.style.padding = '5px';
    deprecationMessage.appendChild(UI.formatLocalized(
        'This panel has been deprecated in favor of the %s interface, which has equivalent functionality.',
        [documentationLink]));

    this.setDefaultFocusedElement(documentationLink);
  }
};

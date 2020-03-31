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
// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as PersistenceModule from './persistence.js';

self.Persistence = self.Persistence || {};
Persistence = Persistence || {};

/** @constructor */
Persistence.Automapping = PersistenceModule.Automapping.Automapping;

/** @constructor */
Persistence.AutomappingStatus = PersistenceModule.Automapping.AutomappingStatus;

/** @constructor */
Persistence.FileSystemWorkspaceBinding = PersistenceModule.FileSystemWorkspaceBinding.FileSystemWorkspaceBinding;

/** @constructor */
Persistence.FileSystemWorkspaceBinding.FileSystem = PersistenceModule.FileSystemWorkspaceBinding.FileSystem;

/** @constructor */
Persistence.IsolatedFileSystem = PersistenceModule.IsolatedFileSystem.IsolatedFileSystem;

/** @constructor */
Persistence.IsolatedFileSystemManager = PersistenceModule.IsolatedFileSystemManager.IsolatedFileSystemManager;

/** @enum {symbol} */
Persistence.IsolatedFileSystemManager.Events = PersistenceModule.IsolatedFileSystemManager.Events;

/** @constructor */
Persistence.NetworkPersistenceManager = PersistenceModule.NetworkPersistenceManager.NetworkPersistenceManager;

Persistence.NetworkPersistenceManager.Events = PersistenceModule.NetworkPersistenceManager.Events;

Persistence.PersistenceActions = {};

/** @constructor */
Persistence.PersistenceActions.ContextMenuProvider = PersistenceModule.PersistenceActions.ContextMenuProvider;

/** @constructor */
Persistence.Persistence = PersistenceModule.Persistence.PersistenceImpl;

Persistence.Persistence.Events = PersistenceModule.Persistence.Events;
Persistence.Persistence._NodeShebang = PersistenceModule.Persistence.NodeShebang;
Persistence.Persistence._NodePrefix = PersistenceModule.Persistence.NodePrefix;
Persistence.Persistence._NodeSuffix = PersistenceModule.Persistence.NodeSuffix;

/** @constructor */
Persistence.PathEncoder = PersistenceModule.Persistence.PathEncoder;

/** @constructor */
Persistence.PersistenceBinding = PersistenceModule.Persistence.PersistenceBinding;

/** @constructor */
Persistence.PersistenceUtils = PersistenceModule.PersistenceUtils.PersistenceUtils;

/** @constructor */
Persistence.PlatformFileSystem = PersistenceModule.PlatformFileSystem.PlatformFileSystem;

/** @constructor */
Persistence.WorkspaceSettingsTab = PersistenceModule.WorkspaceSettingsTab.WorkspaceSettingsTab;

/**
 * @type {!PersistenceModule.IsolatedFileSystemManager.IsolatedFileSystemManager}
 */
self.Persistence.isolatedFileSystemManager;

/** @type {!PersistenceModule.NetworkPersistenceManager.NetworkPersistenceManager} */
self.Persistence.networkPersistenceManager;

/** @type {!PersistenceModule.Persistence.PersistenceImpl} */
self.Persistence.persistence;

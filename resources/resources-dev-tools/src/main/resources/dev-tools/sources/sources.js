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

import * as AddSourceMapURLDialog from './AddSourceMapURLDialog.js';
import * as BreakpointEditDialog from './BreakpointEditDialog.js';
import * as CallStackSidebarPane from './CallStackSidebarPane.js';
import * as CoveragePlugin from './CoveragePlugin.js';
import * as CSSPlugin from './CSSPlugin.js';
import * as DebuggerPausedMessage from './DebuggerPausedMessage.js';
import * as DebuggerPlugin from './DebuggerPlugin.js';
import * as EditingLocationHistoryManager from './EditingLocationHistoryManager.js';
import * as FilePathScoreFunction from './FilePathScoreFunction.js';
import * as FilteredUISourceCodeListProvider from './FilteredUISourceCodeListProvider.js';
import * as GoToLineQuickOpen from './GoToLineQuickOpen.js';
import * as GutterDiffPlugin from './GutterDiffPlugin.js';
import * as InplaceFormatterEditorAction from './InplaceFormatterEditorAction.js';
import * as JavaScriptBreakpointsSidebarPane from './JavaScriptBreakpointsSidebarPane.js';
import * as JavaScriptCompilerPlugin from './JavaScriptCompilerPlugin.js';
import * as NavigatorView from './NavigatorView.js';
import * as OpenFileQuickOpen from './OpenFileQuickOpen.js';
import * as OutlineQuickOpen from './OutlineQuickOpen.js';
import * as Plugin from './Plugin.js';
import * as ScopeChainSidebarPane from './ScopeChainSidebarPane.js';
import * as ScriptFormatterEditorAction from './ScriptFormatterEditorAction.js';
import * as ScriptOriginPlugin from './ScriptOriginPlugin.js';
import * as SearchSourcesView from './SearchSourcesView.js';
import * as SimpleHistoryManager from './SimpleHistoryManager.js';
import * as SnippetsPlugin from './SnippetsPlugin.js';
import * as SourceMapNamesResolver from './SourceMapNamesResolver.js';
import * as SourcesNavigator from './SourcesNavigator.js';
import * as SourcesPanel from './SourcesPanel.js';
import * as SourcesSearchScope from './SourcesSearchScope.js';
import * as SourcesView from './SourcesView.js';
import * as TabbedEditorContainer from './TabbedEditorContainer.js';
import * as ThreadsSidebarPane from './ThreadsSidebarPane.js';
import * as UISourceCodeFrame from './UISourceCodeFrame.js';
import * as WatchExpressionsSidebarPane from './WatchExpressionsSidebarPane.js';

export {
  AddSourceMapURLDialog,
  BreakpointEditDialog,
  CallStackSidebarPane,
  CoveragePlugin,
  CSSPlugin,
  DebuggerPausedMessage,
  DebuggerPlugin,
  EditingLocationHistoryManager,
  FilePathScoreFunction,
  FilteredUISourceCodeListProvider,
  GoToLineQuickOpen,
  GutterDiffPlugin,
  InplaceFormatterEditorAction,
  JavaScriptBreakpointsSidebarPane,
  JavaScriptCompilerPlugin,
  NavigatorView,
  OpenFileQuickOpen,
  OutlineQuickOpen,
  Plugin,
  ScopeChainSidebarPane,
  ScriptFormatterEditorAction,
  ScriptOriginPlugin,
  SearchSourcesView,
  SimpleHistoryManager,
  SnippetsPlugin,
  SourceMapNamesResolver,
  SourcesNavigator,
  SourcesPanel,
  SourcesSearchScope,
  SourcesView,
  TabbedEditorContainer,
  ThreadsSidebarPane,
  UISourceCodeFrame,
  WatchExpressionsSidebarPane,
};
// Copyright 2026 Filippo Savi
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {createContext, useContext} from 'react';

/// The id of the PaneGroup that what is rendered right under it is in; null inside a pane and outside of a group
export const GroupContext = createContext<string | null>(null);

/// Whether the component is right under a PaneGroup, so that it is one of its resizable panes
export const useIsPane = () => useContext(GroupContext) !== null;

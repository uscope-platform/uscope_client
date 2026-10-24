// Copyright 2021 University of Nottingham Ningbo China
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

import {useMemo} from "react";

/// The object that a view edits, built from what the store has. It is a new object whenever the store changes, and
/// also when `revision` does: the store keeps instances that are edited in place, which leaves it holding the same
/// object, so the view says when it has acted on it (the revision of its forceUpdate). Never one that was edited and
/// kept: the React Compiler reuses what a component rendered when the objects it gets are the same ones, so that
/// object would show what it was before the edit.
export const useStoredInstance = <S, I extends object>(stored: S | undefined, build: (stored: S) => I, empty: () => I, revision: number = 0): I =>
    useMemo(() => stored !== undefined ? build(stored) : empty(), [stored, revision]);

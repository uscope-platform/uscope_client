// Copyright 2021 Filippo Savi
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


/// The smallest positive integer that is not one of the ids, in whatever order they come (some callers have the ids
/// as strings, read from names)
export let get_next_id = (ids: (number | string)[]) => {
    const taken = new Set(ids.map(Number));
    let id = 1;
    while(taken.has(id)) id++;
    return id;
}

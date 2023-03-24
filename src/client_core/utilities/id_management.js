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


export let get_next_id =(ids) => {
    let id = null;
    if(ids.length === 0) return 1;
    for(var i = 1; i < ids.length; i++) {
        if(ids[i] - ids[i-1] !== 1) {
            id = ids[i-1]+1;
        }
    }
    if(id===null)
        id = ids.length+1;
    return id;
}
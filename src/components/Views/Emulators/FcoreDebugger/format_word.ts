// Copyright 2024 Filippo Savi
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


/// The words of the core are raw 32 bit values, shown as the float they encode or as the integer
export const format_word = (word: number, vis_type: string): string => {
    if(vis_type === "float"){
        let v = new DataView(new ArrayBuffer(4));
        v.setUint32(0, word);
        return v.getFloat32(0).toString();
    }
    return word.toString();
}

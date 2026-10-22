/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

/// The outlines of the sources and the sinks, shared by the diagram and the library so the entries look like the nodes
export const io_colors = {
    source: "rgb(60, 170, 100)",
    sink: "rgb(230, 140, 40)"
} as const;

export const io_dashes = {
    source: "6 3",
    sink: "2 3"
} as const;

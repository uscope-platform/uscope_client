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

import styled from 'styled-components';

export const UIPanel = styled.div`
  border-radius: 5px;
  overflow:hidden;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background[props.level]};
  border-color: #434343;
  border-width: 2px;
  border-style:solid;
`

export const PanelTitle = styled.div`
  overflow:hidden;
  width: fit-content;
  cursor: default;
  border-color: ${props =>  props.selected ? props.theme.background.accents : "#43434300"};
  border-bottom-width: 3px;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  border-style:solid;
`

export const ContentDiv = styled.div`
  overflow-y:auto;
  overflow-x: hidden;
  border-style:solid;
  border-color: ${props => props.theme.background.borders};
  border-bottom-width: 0;
  border-top-width: 3px;
  border-left-width: 0;
  border-right-width: 0;
`




import styled, {css} from 'styled-components';

export const Button = styled.button`
  background: ${props => props.theme.dark_theme.accents};
  border-color: ${props => props.theme.dark_theme.accents};
  font-weight: bold;
  border-radius: 3px;
  border-style: solid;
  font-size: 16px;
  color: black;
  width: fit-content;
  height: fit-content;
  padding: 0.5em 1em;
   // FULL BUTTONS
   ${props => props.confirm && css`
    background: yellowgreen;
    border-color: yellowgreen;
    color: white;
  `}
  ${props => props.deny && css`
    background: orangered;
    border-color: orangered;
    color: white;
  `}
   // OUTLINE
  ${props => props.outline && css`
    background: transparent;
      color: darkblue;
  `}
   ${props => props.confirm && props.outline && css`
    color: forestgreen;
  `}
  ${props => props.deny && props.outline && css`
    color: darkred;
  `}
`
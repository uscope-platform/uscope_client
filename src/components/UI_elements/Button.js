import styled, {css} from 'styled-components';

const Button = styled.button`
  background: lightblue;
  border-radius: 3px;
  border-style: solid;
  border-color: darkblue;
  color: white;
  margin: 0 1em;
  padding: 0.5em 1em;
   // FULL BUTTONS
   ${props => props.confirm && css`
    background: yellowgreen;
    border-color: forestgreen;
    color: white;
  `}
  ${props => props.deny && css`
    background: orangered;
    border-color: darkred;
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
export default Button;

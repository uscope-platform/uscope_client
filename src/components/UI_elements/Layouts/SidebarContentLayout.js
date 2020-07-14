import styled, {css} from "styled-components";

const SidebarContentLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;
  ${props => props.peripheral && css`
        grid-auto-rows: auto auto 10fr auto;
  `}
  ${props => props.application && css`
        grid-auto-rows: auto 10fr auto;
  `}
  grid-gap: 0.5rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  justify-items: center;
`

export default SidebarContentLayout

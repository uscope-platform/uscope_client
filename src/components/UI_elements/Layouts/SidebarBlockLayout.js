import styled from "styled-components";

export const SidebarBlockLayout = styled.div`
  border-radius: 1rem;
  height: fit-content;
  padding: ${props => {
    if (props.padding) {
        return props.padding
    } else {
        return '0.2rem 0 0.4rem 0.6rem';
    }
  }};
 
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.dark_theme.level_3};
`
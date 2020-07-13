import styled from "styled-components";

const SidebarLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    
    background-color: ${props => props.theme.dark_theme.level_1};
    margin-left: 1rem;
`
export default SidebarLayout

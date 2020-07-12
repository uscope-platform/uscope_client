import styled from "styled-components";

const SidebarContentLayout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr 3fr minmax(1fr, 10fr) 1fr;
  grid-gap: 0.5rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  justify-items: center;
`

export default SidebarContentLayout

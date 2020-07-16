import styled from 'styled-components';

export const Select = styled.select`
  width: fit-content;
  height: 2rem;
  border-radius: 5px;
  min-width: 4em;
  option {
    display: flex;
    justify-content: center;
    min-height: 20px;
  }
`;
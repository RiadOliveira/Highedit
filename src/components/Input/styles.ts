import styled from 'styled-components';

export const Container = styled.input`
  width: 260px;
  height: 18px;
  outline: 0;

  border: 2px solid #d1d1d1;
  border-radius: 6px;
  padding: 10px;

  font-family: Poppins;
  transition: 0.2s;

  &:focus-within {
    background-color: #f0f0f0;
  }
`;

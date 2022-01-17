import styled from 'styled-components';

export const Container = styled.button`
  border: 0;
  outline: 0;
  cursor: pointer;

  width: 30px;
  height: 30px;
  border-radius: 4px;

  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 14px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: transparent;
  border: 2px solid #2b2929;

  transition: 0.2s;

  &:hover {
    background-color: #2b2929;
    color: #fff;
  }
`;

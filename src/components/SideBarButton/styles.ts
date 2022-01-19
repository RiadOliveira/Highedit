import styled, { css } from 'styled-components';

interface ButtonProps {
  active: boolean;
}

export const Container = styled.button<ButtonProps>`
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

  background-color: ${({ active }) => (active ? '#2b2929' : 'transparent')};
  border: 2px solid #2b2929;

  transition: 0.2s;

  ${({ active }) =>
    active
      ? css`
          color: #fff;
        `
      : css`
          &:hover {
            background-color: #2b2929;
            color: #fff;
          }
        `}
`;

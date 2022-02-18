import styled from 'styled-components';

interface InputContainerProps {
  isSecondary?: boolean;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  width: 70%;
`;

export const InputContainer = styled.input<InputContainerProps>`
  &[type='text'] {
    width: ${({ isSecondary }) => (isSecondary ? 130 : 260)}px;
    height: 18px;
    outline: 0;

    border: 2px solid #d1d1d1;
    border-radius: 6px;
    padding: 10px;

    text-align: center;
    font-family: 'Poppins', sans-serif;
    font-size: 20px;
    transition: 0.2s;

    &:focus-within {
      background-color: #f0f0f0;
    }
  }

  &[type='color'] {
    border: none;
    background-color: #fff;
    width: 70px;
    height: 70px;

    &::-webkit-color-swatch {
      border: none;
      border-radius: 50%;
    }

    &::-webkit-color-swatch-wrapper {
      padding: 0;
      width: 70px;
      height: 70px;
      border: 2px solid rgba(0, 0, 0, 0.4);
      border-radius: 50%;
    }
  }
`;

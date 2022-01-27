import styled from 'styled-components';

export const ButtonPair = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;

  width: 100%;
`;

export const Container = styled.aside`
  position: absolute;
  left: 0;
  top: 25%;

  display: flex;
  justify-content: center;
  flex-direction: column;

  height: 42%;
  width: 5%;
  background-color: #fffa6b;

  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  transition: 0.4s;

  ${ButtonPair} + ${ButtonPair} {
    margin-top: 12px;
  }

  @media (max-width: 1600px) {
    height: 52%;
    width: 6.8%;
  }

  @media (max-width: 1280px) {
    width: 90px;
    height: 400px;
  }
`;

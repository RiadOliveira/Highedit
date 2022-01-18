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
  align-items: center;
  flex-direction: column;

  height: 50%;
  width: 5%;
  background-color: #fffa6b;

  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  transition: 0.4s;

  ${ButtonPair} {
    margin-top: 20px;
  }

  ${ButtonPair} + ${ButtonPair} {
    margin-top: 12px;
  }
`;

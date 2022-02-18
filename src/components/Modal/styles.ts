import { animated } from 'react-spring';
import styled from 'styled-components';

export const Container = styled(animated.div)`
  position: absolute;

  width: 100vw;
  height: 100vh;

  top: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentBox = styled.div`
  background-color: #fff;

  width: 420px;
  height: 280px;

  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  p {
    font-size: 22px;
    font-weight: bold;
    font-family: 'Poppins', sans-serif;
    margin: 0;
  }
`;

export const Button = styled.button`
  outline: 0;
  cursor: pointer;

  background-color: #fff;
  border: 2.5px solid #279116;
  border-radius: 6px;

  width: 150px;
  height: 45px;

  color: #000;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 18px;

  transition: 0.3s;

  &:hover {
    background-color: #2cab18;
    color: #fff;
  }
`;

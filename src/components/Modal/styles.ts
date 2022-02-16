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
  height: 260px;

  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 22px;
    font-weight: bold;
    font-family: 'Poppins', sans-serif;

    margin: 20px 0;
  }

  * {
    margin: 20px 0;
  }
`;

export const Button = styled.button`
  outline: 0;
  cursor: pointer;

  background-color: #279116;
  border: none;
  border-radius: 6px;

  width: 150px;
  height: 45px;

  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 16px;

  transition: 0.3s;

  &:hover {
    width: 160px;
    height: 55px;

    font-size: 20px;
  }
`;

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #00112e;

  height: 100vh;
  width: 100vw;

  overflow-y: auto;

  & > h1 {
    font-family: 'Poppins', sans-serif;
    font-size: 48px;
    color: #ffffff;

    margin: 40px 0;
  }
`;

export const EditableArea = styled.main`
  display: flex;
  justify-content: center;

  cursor: text;
  flex: 1;
  width: 100%;

  margin-bottom: 3%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -2%;

    width: 70%;
    height: 2px;

    background-color: #fff;
    opacity: 0.6;

    cursor: auto;
  }
`;

export const TextArea = styled.pre`
  width: 70%;

  border: 0;
  outline: 0;

  overflow: hidden;
  background-color: transparent;
  color: #fff;

  font-family: 'Poppins', sans-serif;
  font-size: 26px;

  a:link {
    text-decoration: inherit;
    color: inherit;
  }

  a:visited {
    text-decoration: inherit;
    color: inherit;
  }

  @media (max-width: 1280px) {
    font-size: 24px;
  }
`;

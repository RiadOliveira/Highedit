import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #00112e;

  height: 100vh;
  width: 100vw;

  overflow-y: auto;

  h1 {
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 42px;

    color: #ffffff;
  }
`;

export const EditableArea = styled.main`
  display: flex;
  justify-content: center;

  cursor: text;
  flex: 1;
  width: 100%;

  margin-bottom: 3%;

  textarea {
    width: 80%;
    resize: none;

    border: 0;
    outline: 0;

    overflow: hidden;
    background-color: transparent;
    color: #fff;

    font-family: 'Poppins', sans-serif;
    font-size: 26px;
  }
`;

import styled, { css } from 'styled-components';

interface ButtonProps {
  active: boolean;
  propName: string;
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

  ${({ propName, active }) => {
    if (propName === '#') {
      return css`
        &:hover {
          background-color: #2b2929;
        }

        span {
          font-size: 18px;

          @keyframes changeColor {
            0% {
              background: rgba(255, 0, 0);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            10% {
              background: rgba(255, 154, 0);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            20% {
              background: rgb(208, 222, 33);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            30% {
              background: rgb(208, 222, 33);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            40% {
              background: rgb(79, 220, 74);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            50% {
              background: rgb(63, 218, 216);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            60% {
              background: rgb(47, 201, 226);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            70% {
              background: rgb(28, 127, 238);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            80% {
              background: rgb(95, 21, 242, 1);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            90% {
              background: rgb(186, 12, 248);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            100% {
              background: rgb(255, 0, 0);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }

          &:hover {
            animation: changeColor infinite 5s;
          }
        }
      `;
    }

    const activeReturn = active
      ? `color: #fff;`
      : `&:hover {
          background-color: #2b2929;
          color: #fff;
        }
      `;

    return css`
      ${activeReturn}
    `;
  }}
`;

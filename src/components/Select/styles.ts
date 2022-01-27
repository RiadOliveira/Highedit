import styled, { css } from 'styled-components';
import { shade } from 'polished';
import { MdArrowDropDown } from 'react-icons/md';

interface SelectProps {
  disabled?: boolean;
}

interface OptionProps {
  isShowingOptions?: boolean;
  hasScrollBar?: boolean;
}

export const Option = styled.button`
  border: 0;
  outline: 0;
  background-color: #fff;

  width: 100%;
  cursor: pointer;

  font-family: 'Poppins', sans-serif;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.3s;

  &:hover {
    background-color: ${shade(0.05, '#fff')};
  }
`;

export const SelectContainer = styled.div<OptionProps>`
  width: 100%;
  height: ${props => (props.isShowingOptions ? '25vh' : '100%')};

  background-color: #fff;
  outline: 0;

  display: flex;
  flex-direction: column;
  -ms-overflow-style: none;

  transition: height 0.3s;

  &::-webkit-scrollbar {
    display: none;
  }

  ${props =>
    props.isShowingOptions
      ? css`
          & button:first-of-type {
            margin-top: 10px;
            border: none;
          }

          ${Option} {
            min-height: 60px;
            width: ${props.hasScrollBar ? '96%' : '100%'};

            p {
              margin-left: 4.2%;
            }
          }
        `
      : css`
          ${Option} {
            min-height: 80px;
          }
        `}
`;

export const Container = styled.div<SelectProps>`
  width: 280px;
  height: 44px;

  position: relative;

  ${({ disabled }) =>
    disabled &&
    css`
      ${Option} {
        color: ${shade(0.5, '#fff')};
        cursor: auto;

        &:hover {
          background-color: #fff;
        }
      }
    `}

  ${SelectContainer} {
    border: 2px solid #c4c4c4;
    border-radius: 20px;
  }

  ${Option} {
    font-size: 26px;
  }
`;

export const ArrowIcon = styled(MdArrowDropDown)`
  position: absolute;
  cursor: pointer;

  right: 5px;
  top: 10%;
`;

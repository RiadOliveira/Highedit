import styled from 'styled-components';
import { shade, lighten } from 'polished';
import { animated } from 'react-spring';

export const Container = styled(animated.aside)`
  position: absolute;
  right: 6px;

  background-color: ${shade(0.1, '#fff')};

  border-radius: 8px;
  width: 18px;

  display: flex;
  justify-content: center;
`;

export const ScrollIndicator = styled(animated.canvas)`
  position: relative;
  background-color: ${lighten(0.25, '#1c274e')};

  width: 10px;
  height: 30px;

  border-radius: 8px;
`;

import React, { useMemo } from 'react';
import GetScreenVhInPixels from 'utils/getScreenVhInPixels';
import { useSpring } from 'react-spring';
import { Container, ScrollIndicator } from './styles';

interface ScrollBarProps {
  scrollTop: number;
  dataLength: number;
}

const ScrollBar: React.FC<ScrollBarProps> = ({ scrollTop, dataLength }) => {
  const maxDistance = useMemo(() => GetScreenVhInPixels(20.5), []);

  // Values have been tested until obtains a good result.
  const margin = 4 + (scrollTop * 2.35) / dataLength;

  const scrollAnimation = useSpring({
    to: {
      marginTop: margin > maxDistance ? maxDistance : margin,
    },
  });

  const appearAnimation = useSpring({
    from: { minHeight: GetScreenVhInPixels(2) },
    to: { minHeight: GetScreenVhInPixels(16.5) },
    config: {
      duration: 300,
    },
  });

  return (
    <Container style={{ ...appearAnimation, top: 6 }}>
      <ScrollIndicator style={scrollAnimation} />
    </Container>
  );
};

export default ScrollBar;

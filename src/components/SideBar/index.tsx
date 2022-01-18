import SideBarButton from 'components/SideBarButton';
import React, { useCallback } from 'react';
import { ButtonPair, Container } from './styles';

const properties = [
  ['h1', 'h2'],
  ['h3', 'h4'],
  ['b', 'i'],
];

interface SideBarProps {
  inputRef: React.RefObject<HTMLDivElement>;
  setTextProperty: (updatedText: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ inputRef, setTextProperty }) => {
  const handleButtonClick = useCallback(
    (property: string) => {
      const textRef = inputRef.current;
      const selection = window.getSelection();

      if (selection && textRef) {
        const content = textRef.innerHTML;
        const start = selection.anchorOffset;
        const end = selection.focusOffset;

        if (start >= 0 && end >= 0) {
          const updatedText: string[] = [];

          if (start === 0) {
            updatedText.push(
              `<${property}>${content.slice(0, end)}</${property}>`,
            );
          } else {
            updatedText.push(
              content.slice(0, start),
              `<${property}>${content.slice(start, end)}</${property}>`,
            );
          }

          updatedText.push(content.slice(end));
          setTextProperty(updatedText.join(''));
        }
      }
    },
    [inputRef, setTextProperty],
  );

  return (
    <Container>
      {properties.map(positions => (
        <ButtonPair key={positions[0] + positions[1]}>
          {positions.map(position => (
            <SideBarButton
              key={position}
              name={position}
              onClick={() => handleButtonClick(position)}
            />
          ))}
        </ButtonPair>
      ))}
    </Container>
  );
};

export default SideBar;

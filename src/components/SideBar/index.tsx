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
  setTextProperty: (updatedChildren: (Node | string)[]) => void;
}

const SideBar: React.FC<SideBarProps> = ({ inputRef, setTextProperty }) => {
  const getNodes = useCallback(
    (property: string): (Node | string)[] => {
      const selection = window.getSelection();
      const textRef = inputRef.current;

      const inputNodes: (Node | string)[] = [];

      if (selection && textRef) {
        const start = selection.anchorOffset;
        const end = selection.focusOffset;
        const parentNode = selection.anchorNode?.parentNode;

        const comparativeNode: Node | null | undefined =
          parentNode !== textRef ? parentNode : selection.anchorNode;

        textRef.childNodes.forEach(child => {
          if (comparativeNode === child) {
            const updatedText: string[] = [];
            const content = child.textContent || '';

            if (start >= 0 && end >= 0) {
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
              inputNodes.push(updatedText.join(''));
            }
          } else {
            inputNodes.push(child);
          }
        });
      }

      return inputNodes;
    },
    [inputRef],
  );

  const handleButtonClick = useCallback(
    (property: string) => {
      if (!inputRef.current?.onfocus) {
        inputRef.current?.focus();
      }

      setTextProperty(getNodes(property));
    },
    [getNodes, inputRef, setTextProperty],
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

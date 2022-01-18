import React, { useCallback } from 'react';
import SideBarButton from 'components/SideBarButton';
import { ButtonPair, Container } from './styles';
import properties, { Property } from '../../utils/properties';

interface SideBarProps {
  inputRef: React.RefObject<HTMLDivElement>;
  setTextProperty: (updatedChildren: (Node | string)[]) => void;
}

const SideBar: React.FC<SideBarProps> = ({ inputRef, setTextProperty }) => {
  const getNodes = useCallback(
    (property: Property): (Node | string)[] => {
      const selection = window.getSelection();
      const textRef = inputRef.current;

      const inputNodes: (Node | string)[] = [];

      if (selection && textRef) {
        const start = selection.anchorOffset;
        const end = selection.focusOffset;
        const parentNode = selection.anchorNode?.parentNode;

        const comparativeNode: Node | null | undefined =
          parentNode !== textRef ? parentNode : selection.anchorNode;

        textRef.childNodes.forEach((child, key) => {
          if (property.type === 'tag' && comparativeNode === child) {
            const updatedText: string[] = [];
            const content = child.textContent || '';

            if (start >= 0 && end >= 0) {
              if (start === 0) {
                updatedText.push(
                  `<${property.name}>${content.slice(0, end)}</${
                    property.name
                  }>`,
                );
              } else {
                updatedText.push(
                  content.slice(0, start),
                  `<${property.name}>${content.slice(start, end)}</${
                    property.name
                  }>`,
                );
              }

              updatedText.push(content.slice(end));
              inputNodes.push(updatedText.join(''));
            }
          } else if (comparativeNode === child && property.type === 'style') {
            if (parentNode !== textRef) {
              const clone = document.createElement(child.nodeName);

              clone.innerText = child.textContent || '';
              clone.setAttribute(
                'style',
                (textRef.children[key].getAttribute('style') || '') +
                  property.code,
              );

              inputNodes.push(clone);
            } else {
              // When it not has a parentElement (Just text)
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
    (property: Property) => {
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
        <ButtonPair key={positions[0].name + positions[1].name}>
          {positions.map((position: Property) => (
            <SideBarButton
              key={position.name}
              name={position.name}
              onClick={() => handleButtonClick(position)}
            />
          ))}
        </ButtonPair>
      ))}
    </Container>
  );
};

export default SideBar;

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

        textRef.childNodes.forEach(child => {
          if (comparativeNode !== child) {
            inputNodes.push(child);
            return;
          }

          const content = child.textContent || '';

          if (property.type === 'tag') {
            const updatedText: string[] = [];

            if (start >= 0 && end >= 0) {
              const { name } = property;

              if (start !== 0) {
                updatedText.push(content.slice(0, start));
              }

              updatedText.push(
                `<${name}>${content.slice(start, end)}</${name}>`,
              );
              updatedText.push(content.slice(end));

              inputNodes.push(updatedText.join(''));
            }
          } else {
            const { cssProp, value } = property.code;

            if (parentNode === textRef) {
              // Has just text.
              const updatedText: string[] = [];

              if (start !== 0) {
                updatedText.push(content.slice(0, start));
              }

              updatedText.push(
                `<span style="${cssProp}:${value};">${content.slice(
                  start,
                  end,
                )}</span>`,
              );
              updatedText.push(content.slice(end));

              inputNodes.push(updatedText.join(''));
              return;
            }

            // Already has tag.
            const styledChild = child.firstChild?.parentElement;
            const hasProp = !!styledChild?.style.getPropertyValue(cssProp);

            if (hasProp) {
              styledChild?.style.removeProperty(cssProp);
            } else {
              styledChild?.style.setProperty(cssProp, value);
            }

            inputNodes.push(styledChild?.outerHTML || '');
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
              Icon={position.type === 'style' ? position.icon : undefined}
              onClick={() => handleButtonClick(position)}
            />
          ))}
        </ButtonPair>
      ))}
    </Container>
  );
};

export default SideBar;

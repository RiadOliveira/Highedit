import React, { useCallback, useEffect, useState } from 'react';
import SideBarButton from 'components/SideBarButton';
import properties, { Property, PropertyName } from 'utils/properties';
import getUpdatedNodes from 'utils/getUpdatedNodes';
import { useElement } from 'hooks/element';
import { ButtonPair, Container } from './styles';

interface SideBarProps {
  inputRef: React.RefObject<HTMLPreElement>;
  setUpdatedText: (updatedChildren: (Node | string)[]) => void;
}

const SideBar: React.FC<SideBarProps> = ({ inputRef, setUpdatedText }) => {
  const [activeProps, setActiveProps] = useState<PropertyName[]>([]);
  const { selectedElement, updateElement } = useElement();

  // To handle selection change and highlight props of selected text.
  useEffect(() => {
    if (selectedElement && selectedElement.nodeName !== 'text') {
      const props: PropertyName[] = [];
      const { nodeName, parentElement, firstChild } = selectedElement;

      const isChild = selectedElement.parentElement !== inputRef.current;

      // To verify and get tags applied and highlighted it (Except section and span).
      if (nodeName !== 'SPAN' && nodeName !== 'SECTION') {
        props.push(nodeName.toLowerCase() as PropertyName);
      }

      if (isChild) {
        props.push(parentElement?.nodeName.toLowerCase() as PropertyName);
      }

      let elementStyle = firstChild?.parentElement?.getAttribute('style');

      // To get parent's styles highlighted too.
      if (isChild) elementStyle += parentElement?.getAttribute('style') || '';

      // Gets all style props that a text has.
      properties.forEach(subprops =>
        subprops.forEach(property => {
          if (property.type === 'style') {
            const {
              name,
              code: { value },
            } = property;

            if (elementStyle?.includes(value)) props.push(name);
          }
        }),
      );

      setActiveProps(props);
    }
  }, [inputRef, selectedElement]);

  const handleButtonClick = useCallback(
    (property: Property) => {
      if (!inputRef.current?.onfocus) inputRef.current?.focus();
      setUpdatedText(getUpdatedNodes(inputRef, property));

      // Resets all activeProps and selectedElement.
      setActiveProps([]);
      updateElement(undefined);
    },
    [inputRef, setUpdatedText, updateElement],
  );

  return (
    <Container>
      {properties.map(positions => (
        <ButtonPair key={positions[0].name + positions[1].name}>
          {positions.map((position: Property) => (
            <SideBarButton
              key={position.name}
              name={position.name}
              Icon={position.icon || position.name}
              active={activeProps.includes(position.name as PropertyName)}
              onClick={() => handleButtonClick(position)}
            />
          ))}
        </ButtonPair>
      ))}
    </Container>
  );
};

export default SideBar;

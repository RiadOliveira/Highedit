import React, { useCallback, useEffect, useState } from 'react';
import SideBarButton from 'components/SideBarButton';
import properties, { Property, PropertyName } from 'utils/properties';
import getUpdatedNodes from 'utils/getUpdatedNodes/index';
import generateElementsUsingArrayPositions2By2 from 'utils/generateElementsUsingArrayPositions2By2';
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
      const { parentElement, firstChild, nodeName } = selectedElement;

      // To verify and get tags applied and highlighted it (Except section and span).
      if (nodeName !== 'SPAN' && nodeName !== 'SECTION') {
        props.push(nodeName.toLowerCase() as PropertyName);
      }

      let elementStyle = firstChild?.parentElement?.getAttribute('style');
      const isChild = selectedElement.parentElement !== inputRef.current;

      // To get parent's styles highlighted too.
      if (isChild) elementStyle += parentElement?.getAttribute('style') || '';

      // Gets all style props that a text has.
      properties.forEach(property => {
        if (property.type === 'style') {
          const {
            name,
            code: { value },
          } = property;

          if (elementStyle?.includes(value)) props.push(name);
        }
      });

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
      {generateElementsUsingArrayPositions2By2(
        properties,
        ButtonPair,
        property => (
          <SideBarButton
            key={property.name}
            name={property.name}
            Icon={property.icon || property.name}
            active={activeProps.includes(property.name as PropertyName)}
            onClick={() => handleButtonClick(property)}
          />
        ),
      )}
    </Container>
  );
};

export default SideBar;
